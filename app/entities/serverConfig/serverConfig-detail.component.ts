import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { MessageService} from '../../service/message.service';
import {ServerConfig} from './serverConfig';
import {ServerConfigService} from './serverConfig.service';
import {Server} from '../server/server';
import { SecurityHelper } from '../../support/security-helper';
@Component({
    moduleId: module.id,
	templateUrl: 'serverConfig-detail.component.html',
	selector: 'serverConfig-detail',
})
export class ServerConfigDetailComponent implements OnInit, OnDestroy {
    serverConfig : ServerConfig;

    private params_subscription: any;
    private allowWriteSensitive: boolean;
    private enableCreateFrom: boolean;

    @Input() sub : boolean = false;
    @Input() // used to pass the parent when creating a new ServerConfig
    set server(server : Server) {
        this.serverConfig = new ServerConfig();
        this.serverConfig.server = server;
    }

    @Output() onSaveClicked = new EventEmitter<ServerConfig>();
    @Output() onCancelClicked = new EventEmitter();

    constructor(private route: ActivatedRoute, private router: Router, private messageService: MessageService, private serverConfigService: ServerConfigService) {
    }

    ngOnInit() {
        if (this.sub) {
            return;
        }

        this.params_subscription = this.route.params.subscribe(params => {
            let id = params['id'];
            console.log('ngOnInit for serverConfig-detail ' + id);

            if (id === 'new') {
                this.serverConfig = new ServerConfig();
                this.enableCreateFrom = false;
            } else {
                this.enableCreateFrom = true;
                this.serverConfigService.getServerConfig(id)
                    .subscribe(
                        serverConfig => this.serverConfig = serverConfig,
                        error =>  this.messageService.error('ngOnInit error', error)
                    );
            }
        });
        
        this.allowWriteSensitive = new SecurityHelper().userHasWriteSensitive();         
    }

    ngOnDestroy() {
        if (!this.sub) {
            this.params_subscription.unsubscribe();
        }
    }

    gotoServer() {
        this.router.navigate(['/server', this.serverConfig.server.id]);
    }

    clearServer() {
        this.serverConfig.server = null;
    }

    onSave() {
        this.serverConfigService.update(this.serverConfig).
            subscribe(
                serverConfig => {
                    this.serverConfig = serverConfig;
                    if (this.sub) {
                        this.onSaveClicked.emit(this.serverConfig);
                        this.messageService.info('Saved OK and msg emitted', 'PrimeNG Rocks ;-)')
                    } else {
                        this.messageService.info('Saved OK', 'PrimeNG Rocks ;-)')
                    }
                    this.enableCreateFrom = true;
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

    onCreateFrom(){
        this.serverConfig.id = undefined;
        this.enableCreateFrom = false;
    }

}
