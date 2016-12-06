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
import {ServerService} from '../server/server.service';
import { PageResponse } from "../../support/paging";

@Component({
    moduleId: module.id,
	templateUrl: 'environment-detail.component.html',
	selector: 'environment-detail',
})
export class EnvironmentDetailComponent implements OnInit, OnDestroy {
    environment : Environment;

    private params_subscription: any;
    private hieraValuesList: HieraValues[];
    private serversToAdd: Server[];
    private serversToRemove: Server[];
    //private currentPage : PageResponse<Server> = new PageResponse<Server>(0,0,[]);
    private envTypes : EnvironmentType[];
    private selectedEnvType : string;
    private listEnvTypes : SelectItem[];
    private showAddSubEnv: boolean;
    private availableSubEnvTypes: SubEnvironmentType[];

    @Input() sub : boolean = false;
    @Input() // used to pass the parent when creating a new Environment
    set release(release : Release) {
        this.environment = new Environment();
        //this.environment.release = release;
    }

    @Output() onSaveClicked = new EventEmitter<Environment>();
    @Output() onCancelClicked = new EventEmitter();
    @Output() onAddNewClicked = new EventEmitter();
    
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
            console.log('ngOnInit for environment-detail ' + id);
            if (id === 'new') {
                this.environment = new Environment();
                //this.environment.servers = new Array<Server>();
                this.showAddSubEnv = true;
            } else {
                this.environmentService.getEnvironment(id)
                    .subscribe(
                        environment => {
                            this.environment = environment;
                            this.environmentService.getAllEnvTypes().subscribe(p => {
                                    this.envTypes = p
                                    // build envType SelectItem Array
                                    this.listEnvTypes = [];
                                    this.listEnvTypes.push({label:'Select Env Type', value:null});
                                    this.envTypes.forEach(element => {
                                        this.listEnvTypes.push(({label: element.name, value:element.name}));
                                    });
                                    this.selectedEnvType = "" + this.environment.type.name;
                                    this.environmentService.getAvailableSubEnvTypesForEnv(this.environment).subscribe(
                                        p=>{
                                            this.availableSubEnvTypes = p;
                                            if (this.availableSubEnvTypes == undefined || this.availableSubEnvTypes.length == 0)
                                                this.showAddSubEnv = false;
                                            else
                                                this.showAddSubEnv = true;
                                        }
                                    );
                                }
                            );
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

    addNewSubEnv() {
        if (this.sub) {
            this.onAddNewClicked.emit("addNew");
        } else {
            this.router.navigate(['/subEnv', 'new', this.environment.id]);
        }
    }
       
    onSave() {
        this.environment.type = this.envTypes.find(this.checkEnvType, this); 
        this.environmentService.update(this.environment).
            subscribe(
                environment => {
                    this.environment = environment;
                    this.environmentService.getHieraValues(this.environment.name).subscribe(p => this.hieraValuesList = p);                    
                    if (this.sub) {
                        this.onSaveClicked.emit(this.environment);
                        this.messageService.info('Saved OK and msg emitted', 'PrimeNG Rocks ;-)')
                    } else {
                        this.messageService.info('Saved OK', 'PrimeNG Rocks ;-)')
                    }
                },
                error =>  this.messageService.error('Could not save', error)
            );
    }

    checkEnvType(currentValue:EnvironmentType, ):boolean{
        return currentValue.name == this.selectedEnvType;
    }
    onCancel() {
        if (this.sub) {
            this.onCancelClicked.emit("cancel");
            this.messageService.info('Cancel clicked and msg emitted', 'PrimeNG Rocks ;-)')
        }
    }

    downLoadHiera(subEnvironment:SubEnvironment){
        window.location.href=this.settings.createBackendURLFor('api/environments/subconfigdownload/' + subEnvironment.id);
    }    

}

/*
    loadPage(event : LazyLoadEvent) {
        this.sService.getServersNotInListByPage(this.environment, event).
            subscribe(
                pageResponse => this.currentPage = pageResponse,
                error => this.messageService.error('Could not get the results', error)
            );
    }

    onAddServers(){
        for (var server of this.serversToAdd){
            this.environment.servers.splice(0,0,server);
            this.currentPage.content.splice(this.currentPage.content.findIndex(x=>x.id==server.id),1);
            // this should really reload the servers page again to populate to 10
        }
    }

    onRemoveServers(){
        for (var server of this.serversToRemove){
            this.currentPage.content.splice(0,0,server);
            // remove the 11th element as our page size is 10
            this.currentPage.content.splice(10,1);
            this.environment.servers.splice(this.environment.servers.findIndex(x=>x.id==server.id),1);

        }
    }
*/

/*
    gotoRelease() {
        this.router.navigate(['/release', this.environment.release.id]);
    }

    clearRelease() {
        this.environment.release = null;
    }
*/
