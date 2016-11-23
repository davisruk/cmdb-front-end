//
// Source code generated by Celerio, a Jaxio product.
// Documentation: http://www.jaxio.com/documentation/celerio/
// Follow us on twitter: @jaxiosoft
// Need commercial support ? Contact us: info@jaxio.com
// Template pack-angular:src/main/webapp/app/entities/entity-detail.component.ts.e.vm
//
import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem, LazyLoadEvent, FilterMetadata } from 'primeng/primeng';
import { MessageService} from '../../service/message.service';
import {Environment} from './environment';
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
    private currentPage : PageResponse<Server> = new PageResponse<Server>(0,0,[]);

    @Input() sub : boolean = false;
    @Input() // used to pass the parent when creating a new Environment
    set release(release : Release) {
        this.environment = new Environment();
        this.environment.release = release;
    }

    @Output() onSaveClicked = new EventEmitter<Environment>();
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
            console.log('ngOnInit for environment-detail ' + id);
            if (id === 'new') {
                this.environment = new Environment();
                this.environment.servers = new Array<Server>();
            } else {
                this.environmentService.getEnvironment(id)
                    .subscribe(
                        environment => {this.environment = environment;
                            this.environmentService.getHieraValues(this.environment.name).subscribe(p => this.hieraValuesList = p);
                        },
                        error =>  this.messageService.error('ngOnInit error', error)
                    );
            }
        });
    }

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

    ngOnDestroy() {
        if (!this.sub) {
            this.params_subscription.unsubscribe();
        }
    }

    gotoRelease() {
        this.router.navigate(['/release', this.environment.release.id]);
    }

    clearRelease() {
        this.environment.release = null;
    }

    onSave() {
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

    onCancel() {
        if (this.sub) {
            this.onCancelClicked.emit("cancel");
            this.messageService.info('Cancel clicked and msg emitted', 'PrimeNG Rocks ;-)')
        }
    }

    onDownload(){
        window.location.href=this.settings.createBackendURLFor('api/environments/configdownload/' + this.environment.name);
    }
}
