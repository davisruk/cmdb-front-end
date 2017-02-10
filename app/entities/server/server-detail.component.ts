import {ViewEncapsulation, Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { MessageService} from '../../service/message.service';
import {Server} from './server';
import {ServerService} from './server.service';
import {ServerType} from '../serverType/serverType';
import {SubEnvironment, SubEnvironmentType} from '../environment/subEnvironment';
import {Environment, EnvironmentType} from '../environment/environment';
import {EnvironmentService} from '../environment/environment.service';
import {HieraValues} from '../hiera/hieraValues';
import {FlatSubEnv} from './flatSubEnv';

@Component({
    moduleId: module.id,
	templateUrl: 'server-detail.component.html',
	selector: 'server-detail',
    styleUrls: ['datatable-overrides.css'],
    encapsulation: ViewEncapsulation.None
})

export class ServerDetailComponent implements OnInit, OnDestroy {
    server : Server;
    private params_subscription: any;
    private hieraValuesList: HieraValues[];
    private subEnvironments: SubEnvironment[];
    private environment: Environment;
    private selectedSubEnvs: SubEnvironment[];
    private flatSubEnvs: FlatSubEnv[];
    private selectedFlatSubEnvs: FlatSubEnv[];

    @Input() sub : boolean = false;
    @Input() // used to pass the parent when creating a new Server
    set serverType(serverType : ServerType) {
        if (this.server == undefined)
            this.server = new Server();
        this.server.serverType = serverType;
    }

    @Input() // used to pass the parent when creating a new Server
    set subEnvironment(subEnv : SubEnvironment[]) {
        if (this.server == undefined)
            this.server = new Server();
        if (this.server.subEnvironments == undefined)
            this.server.subEnvironments = new Array<SubEnvironment>();
        this.server.subEnvironments = subEnv;
    }

    @Output() onSaveClicked = new EventEmitter<Server>();
    @Output() onCancelClicked = new EventEmitter();

    constructor(private route: ActivatedRoute, private router: Router, private messageService: MessageService, 
                private serverService: ServerService, private environmentService: EnvironmentService) {
    }

    ngOnInit() {
        if (this.sub) {
            return;
        }
        this.flatSubEnvs = new Array<FlatSubEnv>();
        this.selectedFlatSubEnvs = new Array<FlatSubEnv>();
        this.params_subscription = this.route.params.subscribe(params => {
            let id = params['id'];
            console.log('ngOnInit for server-detail ' + id);
            if (id === 'new') {
                this.server = new Server();
                this.server.subEnvironments = new Array<SubEnvironment>();
                this.selectedSubEnvs = new Array<SubEnvironment>();
                this.selectedFlatSubEnvs = new Array<FlatSubEnv>();
                this.environmentService.getAllSubEnvs().subscribe(p => {
                        this.subEnvironments = p;
                        this.buildFlatSubEnvArray(this.subEnvironments, this.flatSubEnvs);
                });                
            } else {
                this.serverService.getServer(id)
                    .subscribe(
                        server => {this.server = server;
                            this.environmentService.getSubEnvsWithServer(this.server).subscribe(p => {
                                this.selectedSubEnvs = p;
                                this.buildFlatSubEnvArray( this.selectedSubEnvs, this.selectedFlatSubEnvs);
                                this.subEnvironments = new Array<SubEnvironment>();
                                if (this.selectedSubEnvs != undefined)
                                    this.subEnvironments.push.apply(this.subEnvironments, this.selectedSubEnvs);
                                    this.environmentService.getSubEnvsWithoutServer(this.server).subscribe(p => {
                                        this.subEnvironments.push.apply(this.subEnvironments, p);
                                        this.buildFlatSubEnvArray(this.subEnvironments, this.flatSubEnvs);
                                })
                            });
                        }, 
                        error =>  this.messageService.error('ngOnInit error', error)
                    );
            }
        });
    }

    buildFlatSubEnvArray(subEnvs:SubEnvironment[], flatSubEnvs:FlatSubEnv[]):FlatSubEnv[]{
        subEnvs.forEach(element => {
            flatSubEnvs.push(new FlatSubEnv(element.environment.name,
                                    element.subEnvironmentType.name,
                                    element.id));
        });    
        return flatSubEnvs;
    }
    serverAssigned(se:SubEnvironment):boolean{
        let i:number=this.server.subEnvironments.findIndex(x=>x.id==se.id);
        if (i == undefined)
            return false;
        return true;
    }

    subEnvSelected(event:any){
        if (event.type == "checkbox"){
            let selectedFlatSubEnv:FlatSubEnv = event.data;
            let selectedSubEnv:SubEnvironment = this.subEnvironments[this.subEnvironments.findIndex(x=>x.id==selectedFlatSubEnv.id)];
            this.server.subEnvironments.push(selectedSubEnv);
        }
    }

    subEnvUnselected(event:any){
        if (event.type == "checkbox"){
            let unselectedSubEnv:FlatSubEnv = event.data;
            this.server.subEnvironments.splice(this.server.subEnvironments.findIndex(x=>x.id==unselectedSubEnv.id),1);
        }
    }

    ngOnDestroy() {
        if (!this.sub) {
            this.params_subscription.unsubscribe();
        }
    }

    gotoServerType() {
        this.router.navigate(['/serverType', this.server.serverType.id]);
    }

    clearServerType() {
        this.server.serverType = null;
    }

    onSave() {
        this.serverService.update(this.server).
            subscribe(
                server => {
                    this.server = server;
                    this.serverService.getHieraValues(this.server.name).subscribe(p => this.hieraValuesList = p);
                    if (this.sub) {
                        this.onSaveClicked.emit(this.server);
                        this.messageService.info('Saved OK and msg emitted', 'PrimeNG Rocks ;-)')
                    } else {
                        this.messageService.info('Saved OK', 'PrimeNG Rocks ;-)')
                    }
                },
                error =>  this.messageService.error('Could not save', error)
            );
    }

    onCancel() {
        if (this.sub) {
            this.onCancelClicked.emit("cancel");
            this.messageService.info('Cancel clicked and msg emitted', 'PrimeNG Rocks ;-)')
        }
    }

}
