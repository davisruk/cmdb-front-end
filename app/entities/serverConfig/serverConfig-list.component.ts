import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/primeng';
import { PageResponse } from "../../support/paging";
import { MessageService } from '../../service/message.service';
import { ServerConfig } from './serverConfig';
import { ServerConfigDetailComponent } from './serverConfig-detail.component';
import { ServerConfigService } from './serverConfig.service';
import { CopyContainer } from '../../support/copy-container';
import { Server } from '../server/server';
import { ServerLineComponent } from '../server/server-line.component';

@Component({
    moduleId: module.id,
	templateUrl: 'serverConfig-list.component.html',
	selector: 'serverConfig-list',
})
export class ServerConfigListComponent {

    @Input() header = "All ServerConfigs...";

    // when sub is true, it means this list is a one-to-many list.
    // It belongs to a parent entity, as a result the addNew operation
    // must prefill the parent entity. The prefill is not done here, instead we
    // emit an event.
    @Input() sub : boolean;
    @Output() onAddNewClicked = new EventEmitter();

    serverConfigToDelete : ServerConfig;
    displayDeleteDialog : boolean;
    fromServer : Server;
    toServer : Server;
    private example : ServerConfig = null; // used to query by example...
    private lastLazyLoadEvent : LazyLoadEvent;
    
    // list is paginated
    currentPage : PageResponse<ServerConfig> = new PageResponse<ServerConfig>(0,0,[]);

    // Many to one: input param is used to filter the list when displayed
    // as a one-to-many list by the other side.
    private _server : Server;

    constructor(private router:Router, private serverConfigService : ServerConfigService, private messageService : MessageService) { }

    loadPage(event : LazyLoadEvent) {
         this.lastLazyLoadEvent = event;
        this.serverConfigService.getPage(this.example, event).
            subscribe(
                pageResponse => this.currentPage = pageResponse,
                error => this.messageService.error('Could not get the results', error)
            );
    }

    // Many to one: input param is used to filter the list when displayed
    // as a one-to-many list by the other side.
    @Input()
    set server(server : Server) {
        if (server == null) {
            return;
        }
        this._server = server;

        this.example = new ServerConfig();
        this.example.server = new Server();
        this.example.server.id = this._server.id;
    }


    onRowSelect(event : any) {
        this.router.navigate(['/serverConfig', event.data.id]);
    }

    addNew() {
        if (this.sub) {
            this.onAddNewClicked.emit("addNew");
        } else {
            this.router.navigate(['/serverConfig', 'new']);
        }
    }

    showDeleteDialog(rowData : any) {
        this.serverConfigToDelete = <ServerConfig> rowData;
        this.displayDeleteDialog = true;
    }

    // delete + remove from current page
    delete() {
        this.serverConfigService.delete(this.serverConfigToDelete.id).
            subscribe(
                response => {
                    this.currentPage.remove(this.serverConfigToDelete);
                    this.displayDeleteDialog = false;
                    this.serverConfigToDelete = null;
                    this.messageService.info('Deleted OK', 'PrimeNG Rocks ;-)');
                },
                error => this.messageService.error('Could not delete!', error)
            );
    }

   copyServerConfig(){
        let cc = new CopyContainer();
        cc.fromId = this.fromServer.id;
        cc.toId = this.toServer.id;
        this.serverConfigService.copyConfigForServer(cc).subscribe(
                response => {
                    this.messageService.info('Copied OK', 'PrimeNG Rocks ;-)');
                    this.fromServer = null;
                    this.toServer = null;
                    this.loadPage(this.lastLazyLoadEvent);
                },
                error => this.messageService.error('Could not copy!', error)
            );

    }    
}