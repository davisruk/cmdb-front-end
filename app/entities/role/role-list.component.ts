import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/primeng';
import { PageResponse } from "../../support/paging";
import { MessageService } from '../../service/message.service';

import { Role } from './role';
import { RoleService } from './role.service';


@Component({
    moduleId: module.id,
    selector: 'role-list',
    templateUrl: 'role-list.component.html'
})
export class RoleListComponent {
    @Input() header = "All Roles...";

    // when sub is true, it means this list is a one-to-many list.
    // It belongs to a parent entity, as a result the addNew operation
    // must prefill the parent entity. The prefill is not done here, instead we
    // emit an event.
    @Input() sub : boolean;
    @Output() onAddNewClicked = new EventEmitter();

    roleToDelete : Role;
    displayDeleteDialog : boolean;

    private example : Role = null; // used to query by example...

    // list is paginated
    currentPage : PageResponse<Role> = new PageResponse<Role>(0,0,[]);


    constructor(private router:Router, private roleService : RoleService, private messageService : MessageService) { }
    loadPage(event : LazyLoadEvent) {
        this.roleService.getPage(this.example, event).
            subscribe(
                pageResponse => this.currentPage = pageResponse,
                error => this.messageService.error('Could not get the results', error)
            );
    }

    onRowSelect(event : any) {
        this.router.navigate(['/role', event.data.id]);
    }

    addNew() {
        if (this.sub) {
            this.onAddNewClicked.emit("addNew");
        } else {
            this.router.navigate(['/role', 'new']);
        }
    }

    showDeleteDialog(rowData : any) {
        this.roleToDelete = <Role> rowData;
        this.displayDeleteDialog = true;
    }

    // delete + remove from current page
    delete() {
        this.roleService.delete(this.roleToDelete.id).
            subscribe(
                response => {
                    this.currentPage.remove(this.roleToDelete);
                    this.displayDeleteDialog = false;
                    this.roleToDelete = null;
                    this.messageService.info('Deleted OK', 'We lost another one!');
                },
                error => this.messageService.error('Could not delete!', error)
            );
    }    
}