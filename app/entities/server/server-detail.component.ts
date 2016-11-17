//
// Source code generated by Celerio, a Jaxio product.
// Documentation: http://www.jaxio.com/documentation/celerio/
// Follow us on twitter: @jaxiosoft
// Need commercial support ? Contact us: info@jaxio.com
// Template pack-angular:src/main/webapp/app/entities/entity-detail.component.ts.e.vm
//
import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { MessageService} from '../../service/message.service';
import {Server} from './server';
import {ServerService} from './server.service';
import {ServerType} from '../serverType/serverType';
import {Environment} from '../environment/environment';
import {EnvironmentService} from '../environment/environment.service';
import {HieraValues} from '../hiera/hieraValues';

@Component({
    moduleId: module.id,
	templateUrl: 'server-detail.component.html',
	selector: 'server-detail',
})
export class ServerDetailComponent implements OnInit, OnDestroy {
    server : Server;

    private params_subscription: any;
    private hieraValuesList: HieraValues[];
    private availableEnvironments: Environment[];

    @Input() sub : boolean = false;
    @Input() // used to pass the parent when creating a new Server
    set serverType(serverType : ServerType) {
        this.server = new Server();
        this.server.serverType = serverType;
    }

/*
    @Input() // used to pass the parent when creating a new Server
    set environment(environment : Environment) {
        this.server = new Server();
        this.server.environment = environment;
    }
*/
    @Output() onSaveClicked = new EventEmitter<Server>();
    @Output() onCancelClicked = new EventEmitter();

    constructor(private route: ActivatedRoute, private router: Router, private messageService: MessageService, 
                private serverService: ServerService, private environmentService: EnvironmentService) {
    }

    ngOnInit() {
        if (this.sub) {
            return;
        }

        this.params_subscription = this.route.params.subscribe(params => {
            let id = params['id'];
            console.log('ngOnInit for server-detail ' + id);

            if (id === 'new') {
                this.server = new Server();
                this.server.environments = new Array<Environment>();
                this.environmentService.getAll().subscribe(p => this.availableEnvironments = p);
            } else {
                this.serverService.getServer(id)
                    .subscribe(
                        server => {this.server = server;
                            this.serverService.getHieraValues(this.server.name).subscribe(p => this.hieraValuesList = p)
                            this.serverService.getUnassignedEnvironmentsForServer(this.server).subscribe(p => this.availableEnvironments = p);
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

    gotoServerType() {
        this.router.navigate(['/serverType', this.server.serverType.id]);
    }

    clearServerType() {
        this.server.serverType = null;
    }

    clearEnvironment() {
        this.server.environment = null;
    }

    onSave() {
        this.serverService.update(this.server).
            subscribe(
                server => {
                    this.server = server;
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
