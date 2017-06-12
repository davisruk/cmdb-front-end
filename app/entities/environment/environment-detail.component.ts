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
import { RefreshComponent } from '../../support/refresh.component';

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
    private showRefresh : boolean;

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
            this.showRefresh = false;
            if (id === 'new') {
                this.environment = new Environment();
                this.environmentService.getAllEnvTypes().subscribe(p => {
                        this.envTypes = p
                        // build envType SelectItem Array
                        this.listEnvTypes = [];
                        this.listEnvTypes.push({label:'Select Env Type', value:null});
                        this.envTypes.forEach(element => {
                            this.listEnvTypes.push(({label: element.name, value:element.name}));
                        });
                        this.selectedEnvType = this.listEnvTypes[0].label;
                        this.environmentService.getAvailableSubEnvTypesForEnv(this.environment).subscribe(
                            p=>{
                                this.availableSubEnvTypes = p;
                                this.setAddSubEnvButtonStatus();
                            }
                        );
                    }
                );
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
                                            this.setAddSubEnvButtonStatus();
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
       
    onSelectEnvType(evt:any){
        this.setAddSubEnvButtonStatus();
    }

    setAddSubEnvButtonStatus(){
        if (this.availableSubEnvTypes == undefined ||
            this.availableSubEnvTypes.length == 0 ||
            this.environment == undefined ||
            this.environment.id == undefined ||
            this.environment.name == undefined || this.environment.name.length == 0 ||
            this.selectedEnvType == undefined ||
            this.selectedEnvType == this.listEnvTypes[0].label)
            this.showAddSubEnv = false;
        else
            this.showAddSubEnv = true;
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
                    this.showRefresh = false;
                    this.setAddSubEnvButtonStatus();
                },
                error =>  {
                    this.messageService.error('Could not save', error);
                    this.showRefresh = true;
                }
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
        subEnvironment.environment = this.environment;
        this.environmentService.downloadSubEnvHieraData(subEnvironment.environment.name +
                                                         "_" + subEnvironment.subEnvironmentType.name +
                                                         "_hiera.csv", subEnvironment.id);
    }    

    onRefresh(newData: Environment){
	    this.environment = newData;
        this.selectedEnvType = "" + this.environment.type.name;
        this.showRefresh = false;
    }
}

