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
export class EnvironmentListComponent {

    @Input() header = "All Environments...";

    // when sub is true, it means this list is a one-to-many list.
    // It belongs to a parent entity, as a result the addNew operation
    // must prefill the parent entity. The prefill is not done here, instead we
    // emit an event.
    @Input() sub : boolean;
    @Output() onAddNewClicked = new EventEmitter();

    environmentToDelete : Environment;
    displayDeleteDialog : boolean;

    private example : Environment = null; // used to query by example...

    // list is paginated
    currentPage : PageResponse<Environment> = new PageResponse<Environment>(0,0,[]);

    // Many to one: input param is used to filter the list when displayed
    // as a one-to-many list by the other side.
    private _release : Release;

    constructor(private router:Router, private environmentService : EnvironmentService,
                private messageService : MessageService, private settings: Configuration) { }

    loadPage(event : LazyLoadEvent) {
        this.environmentService.getPage(this.example, event).
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

        this.example = new Environment();
        this.example.release = new Release();
        this.example.release.id = this._release.id;
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

    onDownload(){
        window.location.href=this.settings.createBackendURLFor('api/environments/configdownloadall/');
    }
    
}