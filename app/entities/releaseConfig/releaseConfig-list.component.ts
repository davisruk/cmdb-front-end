import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/primeng';
import { PageResponse } from "../../support/paging";
import { MessageService } from '../../service/message.service';
import { ReleaseConfig } from './releaseConfig';
import { ReleaseConfigDetailComponent } from './releaseConfig-detail.component';
import { ReleaseConfigService } from './releaseConfig.service';

import { Release } from '../release/release';
import { ReleaseLineComponent } from '../release/release-line.component';

@Component({
    moduleId: module.id,
	templateUrl: 'releaseConfig-list.component.html',
	selector: 'releaseConfig-list',
})
export class ReleaseConfigListComponent {

    @Input() header = "All ReleaseConfigs...";

    // when sub is true, it means this list is a one-to-many list.
    // It belongs to a parent entity, as a result the addNew operation
    // must prefill the parent entity. The prefill is not done here, instead we
    // emit an event.
    @Input() sub : boolean;
    @Output() onAddNewClicked = new EventEmitter();

    releaseConfigToDelete : ReleaseConfig;
    displayDeleteDialog : boolean;

    private example : ReleaseConfig = null; // used to query by example...

    // list is paginated
    currentPage : PageResponse<ReleaseConfig> = new PageResponse<ReleaseConfig>(0,0,[]);

    // Many to one: input param is used to filter the list when displayed
    // as a one-to-many list by the other side.
    private _release : Release;

    constructor(private router:Router, private releaseConfigService : ReleaseConfigService, private messageService : MessageService) { }

    loadPage(event : LazyLoadEvent) {
        // if the filter is defined then build the example
        this.example = null;
        if (event.filters != undefined){
            if (event.filters["release.name"] != undefined) {
                this.example = new ReleaseConfig().searchByExampleWithNameFactory(event.filters["release.name"].value);
                event.filters["release.name"].matchMode="contains";
            }

            if (event.filters["parameter"] != undefined) {
                if (this.example == undefined)
                    this.example = new ReleaseConfig().searchByExampleWithParameterFactory(event.filters["parameter"].value);
                else
                    this.example.parameter = event.filters["parameter"].value;
                event.filters["parameter"].matchMode="contains";
            }
        }
        this.releaseConfigService.getPage(this.example, event).
            subscribe(
                pageResponse => this.currentPage = pageResponse,
                error => this.messageService.error('Could not get the results', error)
            );
    }

    // Many to one: input param is used to filter the list when displayed
    // as a one-to-many list by the other side.
    @Input()
    set release(release : Release) {
        if (release == null) {
            return;
        }
        this._release = release;

        this.example = new ReleaseConfig();
        this.example.release = new Release();
        this.example.release.id = this._release.id;
    }


    onRowSelect(event : any) {
        this.router.navigate(['/releaseConfig', event.data.id]);
    }

    addNew() {
        if (this.sub) {
            this.onAddNewClicked.emit("addNew");
        } else {
            this.router.navigate(['/releaseConfig', 'new']);
        }
    }

    showDeleteDialog(rowData : any) {
        this.releaseConfigToDelete = <ReleaseConfig> rowData;
        this.displayDeleteDialog = true;
    }

    // delete + remove from current page
    delete() {
        this.releaseConfigService.delete(this.releaseConfigToDelete.id).
            subscribe(
                response => {
                    this.currentPage.remove(this.releaseConfigToDelete);
                    this.displayDeleteDialog = false;
                    this.releaseConfigToDelete = null;
                    this.messageService.info('Deleted OK', 'PrimeNG Rocks ;-)');
                },
                error => this.messageService.error('Could not delete!', error)
            );
    }
}