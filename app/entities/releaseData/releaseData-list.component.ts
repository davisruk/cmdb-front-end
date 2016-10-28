//
// Source code generated by Celerio, a Jaxio product.
// Documentation: http://www.jaxio.com/documentation/celerio/
// Follow us on twitter: @jaxiosoft
// Need commercial support ? Contact us: info@jaxio.com
// Template pack-angular:src/main/webapp/app/entities/entity-list.component.ts.e.vm
//
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/primeng';
import { PageResponse } from "../../support/paging";
import { MessageService } from '../../service/message.service';
import { ReleaseData } from './releaseData';
import { ReleaseDataDetailComponent } from './releaseData-detail.component';
import { ReleaseDataService } from './releaseData.service';

import { Release } from '../release/release';
import { ReleaseLineComponent } from '../release/release-line.component';
import { ReleaseDataType } from '../releaseDataType/releaseDataType';
import { ReleaseDataTypeLineComponent } from '../releaseDataType/releaseDataType-line.component';

@Component({
    moduleId: module.id,
	templateUrl: 'releaseData-list.component.html',
	selector: 'releaseData-list',
})
export class ReleaseDataListComponent {

    @Input() header = "All ReleaseDatas...";

    // when sub is true, it means this list is a one-to-many list.
    // It belongs to a parent entity, as a result the addNew operation
    // must prefill the parent entity. The prefill is not done here, instead we
    // emit an event.
    @Input() sub : boolean;
    @Output() onAddNewClicked = new EventEmitter();

    releaseDataToDelete : ReleaseData;
    displayDeleteDialog : boolean;

    private example : ReleaseData = null; // used to query by example...

    // list is paginated
    currentPage : PageResponse<ReleaseData> = new PageResponse<ReleaseData>(0,0,[]);

    // Many to one: input param is used to filter the list when displayed
    // as a one-to-many list by the other side.
    private _release : Release;
    private _dataType : ReleaseDataType;

    constructor(private router:Router, private releaseDataService : ReleaseDataService, private messageService : MessageService) { }

    loadPage(event : LazyLoadEvent) {
        this.releaseDataService.getPage(this.example, event).
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

        this.example = new ReleaseData();
        this.example.release = new Release();
        this.example.release.id = this._release.id;
    }

    @Input()
    set dataType(dataType : ReleaseDataType) {
        if (dataType == null) {
            return;
        }
        this._dataType = dataType;

        this.example = new ReleaseData();
        this.example.dataType = new ReleaseDataType();
        this.example.dataType.id = this._dataType.id;
    }


    onRowSelect(event : any) {
        this.router.navigate(['/releaseData', event.data.id]);
    }

    addNew() {
        if (this.sub) {
            this.onAddNewClicked.emit("addNew");
        } else {
            this.router.navigate(['/releaseData', 'new']);
        }
    }

    showDeleteDialog(rowData : any) {
        this.releaseDataToDelete = <ReleaseData> rowData;
        this.displayDeleteDialog = true;
    }

    // delete + remove from current page
    delete() {
        this.releaseDataService.delete(this.releaseDataToDelete.id).
            subscribe(
                response => {
                    this.currentPage.remove(this.releaseDataToDelete);
                    this.displayDeleteDialog = false;
                    this.releaseDataToDelete = null;
                    this.messageService.info('Deleted OK', 'PrimeNG Rocks ;-)');
                },
                error => this.messageService.error('Could not delete!', error)
            );
    }
}