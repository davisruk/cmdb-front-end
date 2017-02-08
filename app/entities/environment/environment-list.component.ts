import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/primeng';
import { PageResponse } from "../../support/paging";
import { MessageService } from '../../service/message.service';
import { Environment } from './environment';
import { EnvironmentDetailComponent } from './environment-detail.component';
import { EnvironmentService } from './environment.service';

import { Release } from '../release/release';
import { ReleaseLineComponent } from '../release/release-line.component';
import { Configuration } from '../../support/configuration';

@Component({
    moduleId: module.id,
	templateUrl: 'environment-list.component.html',
	selector: 'environment-list',
})
export class EnvironmentListComponent{

    @Input() header = "All Environments...";

    // when sub is true, it means this list is a one-to-many list.
    // It belongs to a parent entity, as a result the addNew operation
    // must prefill the parent entity. The prefill is not done here, instead we
    // emit an event.
    @Input() sub : boolean;
    @Output() onAddNewClicked = new EventEmitter();

    environmentToDelete : Environment;
    displayDeleteDialog : boolean;
    firstTime : boolean;
    private example : Environment = null; // used to query by example...

    // list is paginated
    currentPage : PageResponse<Environment> = new PageResponse<Environment>(0,0,[]);

    // Many to one: input param is used to filter the list when displayed
    // as a one-to-many list by the other side.
    //private _release : Release;

    constructor(private router:Router, private environmentService : EnvironmentService,
                private messageService : MessageService, private settings: Configuration) { }

    loadPage(event : LazyLoadEvent) {
        this.example = new Environment();
        // if the filter is defined then build the example
        if (event.filters != undefined && event.filters["name"] != undefined &&
            this.example.name != event.filters["name"].value){
                this.example.name = event.filters["name"].value;
                event.filters["name"].matchMode="contains";
        }
        this.environmentService.getPage(this.example, event).
            subscribe(
                pageResponse => this.currentPage = pageResponse,
                error => this.messageService.error('Could not get the results', error)
            );
    }

    onRowSelect(event : any) {
        this.router.navigate(['/environment', event.data.id]);
    }

    addNew() {
        if (this.sub) {
            this.onAddNewClicked.emit("addNew");
        } else {
            this.router.navigate(['/environment', 'new']);
        }
    }

    showDeleteDialog(rowData : any) {
        this.environmentToDelete = <Environment> rowData;
        this.displayDeleteDialog = true;
    }

    // delete + remove from current page
    delete() {
        this.environmentService.delete(this.environmentToDelete.id).
            subscribe(
                response => {
                    this.currentPage.remove(this.environmentToDelete);
                    this.displayDeleteDialog = false;
                    this.environmentToDelete = null;
                    this.messageService.info('Deleted OK', 'PrimeNG Rocks ;-)');
                },
                error => this.messageService.error('Could not delete!', error)
            );
    }

    downloadAllHieraData(){
        this.environmentService.downloadAllHieraData("complete_hiera.csv");
    }

    downloadAllHieraDataAsYAML(){
        this.environmentService.downloadAllHieraDataAsYAML("config.yml");
    }
    

    downloadAllHieraByEnv(environment:Environment){
        this.environmentService.downloadEnvHieraData(environment.name + "_hiera.csv", environment.id);
    }
}