import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem, LazyLoadEvent, FilterMetadata } from 'primeng/primeng';
import { MessageService} from '../../service/message.service';
import {Environment, EnvironmentType} from './environment';
import {SubEnvironment, SubEnvironmentType} from './subEnvironment';
import {EnvironmentService} from './environment.service';
import {Release} from '../release/release';
import {HieraValues} from '../hiera/hieraValues';
import {Configuration} from '../../support/configuration';
import {Server} from '../server/server';
import {ServerType} from '../serverType/serverType';
import {ServerService} from '../server/server.service';
import { PageResponse } from "../../support/paging";

@Component({
    moduleId: module.id,
	templateUrl: 'subenvironment-detail.component.html',
	selector: 'subenvironment-detail',
})
export class SubEnvironmentDetailComponent implements OnInit, OnDestroy {
    subEnvironment : SubEnvironment;
    private params_subscription: any;
    private hieraValuesList: HieraValues[];
    private serversToAdd: Server[];
    private serversToRemove: Server[];
    private currentPage : PageResponse<Server> = new PageResponse<Server>(0,0,[]);
    private subEnvTypes : SubEnvironmentType[];
    private selectedSubEnvType : string;
    private listSubEnvTypes : SelectItem[];
    private lastLazyLoadEvent : LazyLoadEvent;

    @Input() sub : boolean = false;
    @Input() // used to pass the parent when creating a new Environment
    set release(release : Release) {
        this.subEnvironment = new SubEnvironment();
        this.subEnvironment.release = release;
    }

    @Output() onSaveClicked = new EventEmitter<SubEnvironment>();
    @Output() onCancelClicked = new EventEmitter();

    constructor(private route: ActivatedRoute, private router: Router, 
                private messageService: MessageService, private environmentService: EnvironmentService,
                private sService: ServerService, private settings : Configuration) {
    }

    ngOnInit() {
        if (this.sub) {
            return;
        }
        this.params_subscription = this.route.params.subscribe(params => {
            let id = params['id'];
            console.log('ngOnInit for subenvironment-detail ' + id);
            if (id === 'new') {
                this.subEnvironment = new SubEnvironment();
                this.subEnvironment.servers = new Array<Server>();
            } else {
                this.environmentService.getSubEnvironment(id)
                    .subscribe(
                        subEnvironment => {
                            this.subEnvironment = subEnvironment;
                            // get all subenvtypes not in environment
                            this.environmentService.getAvailableSubEnvTypes(subEnvironment).subscribe(
                                p =>{
                                        this.subEnvTypes = p
                                        // build envType SelectItem Array
                                        this.listSubEnvTypes = [];
                                        this.listSubEnvTypes.push({label:'Select Env Type', value:null});
                                        this.subEnvTypes.forEach(element => {
                                            this.listSubEnvTypes.push(({label: element.name, value:element.name}));
                                        });
                                        this.selectedSubEnvType = "" + this.subEnvironment.subEnvironmentType.name;
                                    }
                                )
                            },
                            error =>  this.messageService.error('ngOnInit error', error)
                        );
            }
        });
    }
    ngOnDestroy() {
        if (!this.sub) {
            this.params_subscription.unsubscribe();
        }
    }

    editSubEnv(subEnv:SubEnvironment) {
        this.router.navigate(['/subEnv', subEnv.id]);
    }

       
    onSave() {
        this.subEnvironment.subEnvironmentType = this.subEnvTypes.find(this.checkSubEnvType, this);
        this.environmentService.updateSubEnvironment(this.subEnvironment).
            subscribe(
                subEnvironment => {
                    this.subEnvironment = subEnvironment;
                    //this.environmentService.getHieraValues(this.environment.name).subscribe(p => this.hieraValuesList = p);                    
                    if (this.sub) {
                        this.onSaveClicked.emit(this.subEnvironment);
                        this.messageService.info('Saved OK and msg emitted', 'PrimeNG Rocks ;-)')
                    } else {
                        this.messageService.info('Saved OK', 'PrimeNG Rocks ;-)')
                    }
                },
                error =>  this.messageService.error('Could not save', error)
            );
    }

    checkSubEnvType(currentValue:SubEnvironmentType, ):boolean{
        return currentValue.name == this.selectedSubEnvType;
    }

    onCancel() {
        if (this.sub) {
            this.onCancelClicked.emit("cancel");
            this.messageService.info('Cancel clicked and msg emitted', 'PrimeNG Rocks ;-)')
        }
    }

    downLoadHiera(){
        window.location.href=this.settings.createBackendURLFor('api/environments/subconfigdownload/' + this.subEnvironment.id);
    }    

    loadPage(event : LazyLoadEvent) {
        this.lastLazyLoadEvent = event;
        this.getAvailableServers(this.subEnvironment, event);
    }

    getAvailableServers(env : SubEnvironment, evt : LazyLoadEvent){
        if (this.subEnvironment.servers == undefined || this.subEnvironment.servers.length == 0){
            // there are no assigned servers so fetch all (paginated obviously)
            // also apply any filters the user has created - use by example search
            let example : Server = new Server();
            if (evt.filters != undefined){
                if (evt.filters["name"] != undefined){
                    example.name = evt.filters["name"].value;
                }
                if (evt.filters["serverType.name"]){
                    example.serverType = new ServerType();
                    example.serverType.name = evt.filters["serverType.name"].value;
                }
            } 
            this.sService.getPage(example, evt).subscribe(
                pageResponse => this.currentPage = pageResponse,
                error => this.messageService.error('Could not get the results', error)
            );
        }
        else{
            // there are assigned servers so we need to exclude them
            // again applying filters carried by the event but this
            // time we can't use by example query
            this.sService.getServersNotInListByPage(env, evt).
                subscribe(
                    pageResponse => this.currentPage = pageResponse,
                    error => this.messageService.error('Could not get the results', error)
                );
        }
    }

    onAddServers(){
        for (var server of this.serversToAdd){
            this.subEnvironment.servers.splice(0,0,server);
            this.currentPage.content.splice(this.currentPage.content.findIndex(x=>x.id==server.id),1);
        }
        if (this.serversToAdd.length > 0 &&
                this.currentPage.totalElements - this.serversToAdd.length < this.lastLazyLoadEvent.rows){
            // set to page 1 as we have fewer servers than rows on a page    
            this.lastLazyLoadEvent.first = 0;
        }    
        this.getAvailableServers(this.subEnvironment, this.lastLazyLoadEvent);
    }

    onRemoveServers(){
        for (var server of this.serversToRemove){
            this.currentPage.content.splice(0,0,server);
            // remove the 11th element as our page size is 10
            this.currentPage.content.splice(10,1);
            this.subEnvironment.servers.splice(this.subEnvironment.servers.findIndex(x=>x.id==server.id),1);
        }
        if (this.serversToRemove.length > 0 && 
            this.currentPage.totalElements + this.serversToRemove.length > this.lastLazyLoadEvent.rows){
            // need to get data from the db because we've gone over our page size
            this.getAvailableServers(this.subEnvironment, this.lastLazyLoadEvent);
        }
    }

   gotoRelease() {
        this.router.navigate(['/release', this.subEnvironment.release.id]);
    }

    clearRelease() {
        this.subEnvironment.release = null;
    }
}