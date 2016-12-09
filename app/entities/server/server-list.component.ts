import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, FilterMetadata } from 'primeng/primeng';
import { PageResponse } from "../../support/paging";
import { MessageService } from '../../service/message.service';
import { Server } from './server';
import { ServerDetailComponent } from './server-detail.component';
import { ServerService } from './server.service';

import { ServerType } from '../serverType/serverType';
import { ServerTypeLineComponent } from '../serverType/serverType-line.component';
import { Environment } from '../environment/environment';
import { EnvironmentLineComponent } from '../environment/environment-line.component';

@Component({
    moduleId: module.id,
	templateUrl: 'server-list.component.html',
	selector: 'server-list',
})
export class ServerListComponent {

    @Input() header = "All Servers...";

    // when sub is true, it means this list is a one-to-many list.
    // It belongs to a parent entity, as a result the addNew operation
    // must prefill the parent entity. The prefill is not done here, instead we
    // emit an event.
    @Input() sub : boolean;
    @Output() onAddNewClicked = new EventEmitter();

    serverToDelete : Server;
    displayDeleteDialog : boolean;

    private example : Server = null; // used to query by example...

    // list is paginated
    currentPage : PageResponse<Server> = new PageResponse<Server>(0,0,[]);

    // Many to one: input param is used to filter the list when displayed
    // as a one-to-many list by the other side.
    private _serverType : ServerType;
    private _environment : Environment;
    private lastEvent : LazyLoadEvent;

    constructor(private router:Router, private serverService : ServerService, private messageService : MessageService) { }

    loadPage(event : LazyLoadEvent) {
        let sendEventToServer:boolean = false;
        if (event.filters != undefined && event.filters["name"] != undefined){
            if (this.example == undefined || this.example.name != event.filters["name"].value){
                this.example = new Server();
                this.example.name = event.filters["name"].value;
                event.filters["name"].matchMode="contains";
                sendEventToServer = true;
            }
        }
        if (event.first == undefined || this.lastEvent == undefined || this.lastEvent.first != event.first)
        {
            sendEventToServer = true;
        }
        
        if (sendEventToServer)
            this.serverService.getPage(this.example, event).
        subscribe(
            pageResponse => {
                                this.currentPage = pageResponse;
                                this.lastEvent = event;
            },

            error => this.messageService.error('Could not get the results', error)
        );


    }

    // Many to one: input param is used to filter the list when displayed
    // as a one-to-many list by the other side.
    @Input()
    set serverType(serverType : ServerType) {
        if (serverType == null) {
            return;
        }
        this._serverType = serverType;

        this.example = new Server();
        this.example.serverType = new ServerType();
        this.example.serverType.id = this._serverType.id;
    }

    onRowSelect(event : any) {
        this.router.navigate(['/server', event.data.id]);
    }

    addNew() {
        if (this.sub) {
            this.onAddNewClicked.emit("addNew");
        } else {
            this.router.navigate(['/server', 'new']);
        }
    }

    showDeleteDialog(rowData : any) {
        this.serverToDelete = <Server> rowData;
        this.displayDeleteDialog = true;
    }

    // delete + remove from current page
    delete() {
        this.serverService.delete(this.serverToDelete.id).
            subscribe(
                response => {
                    this.currentPage.remove(this.serverToDelete);
                    this.displayDeleteDialog = false;
                    this.serverToDelete = null;
                    this.messageService.info('Deleted OK', 'PrimeNG Rocks ;-)');
                },
                error => this.messageService.error('Could not delete!', error)
            );
    }
}