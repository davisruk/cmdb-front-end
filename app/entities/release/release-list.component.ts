import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/primeng';
import { PageResponse } from "../../support/paging";
import { MessageService } from '../../service/message.service';
import { Configuration } from '../../support/configuration';
import { Release } from './release';
import { ReleaseDetailComponent } from './release-detail.component';
import { ReleaseService } from './release.service';


@Component({
    moduleId: module.id,
	templateUrl: 'release-list.component.html',
	selector: 'release-list',
})
export class ReleaseListComponent {

    @Input() header = "All Releases...";

    // when sub is true, it means this list is a one-to-many list.
    // It belongs to a parent entity, as a result the addNew operation
    // must prefill the parent entity. The prefill is not done here, instead we
    // emit an event.
    @Input() sub : boolean;
    @Output() onAddNewClicked = new EventEmitter();

    releaseToDelete : Release;
    displayDeleteDialog : boolean;

    private example : Release = null; // used to query by example...

    // list is paginated
    currentPage : PageResponse<Release> = new PageResponse<Release>(0,0,[]);


    constructor(private router:Router, private releaseService:ReleaseService,
                    private messageService:MessageService, private settings: Configuration) { }

    loadPage(event : LazyLoadEvent) {
        this.releaseService.getPage(this.example, event).
            subscribe(
                pageResponse => this.currentPage = pageResponse,
                error => this.messageService.error('Could not get the results', error)
            );
    }

    onRowSelect(event : any) {
        this.router.navigate(['/release', event.data.id]);
    }

    addNew() {
        if (this.sub) {
            this.onAddNewClicked.emit("addNew");
        } else {
            this.router.navigate(['/release', 'new']);
        }
    }

    showDeleteDialog(rowData : any) {
        this.releaseToDelete = <Release> rowData;
        this.displayDeleteDialog = true;
    }

    // delete + remove from current page
    delete() {
        this.releaseService.delete(this.releaseToDelete.id).
            subscribe(
                response => {
                    this.currentPage.remove(this.releaseToDelete);
                    this.displayDeleteDialog = false;
                    this.releaseToDelete = null;
                    this.messageService.info('Deleted OK', 'PrimeNG Rocks ;-)');
                },
                error => this.messageService.error('Could not delete!', error)
            );
    }
}