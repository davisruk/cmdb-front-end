import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/primeng';
import { PageResponse } from "../../support/paging";
import { MessageService } from '../../service/message.service';

import { User } from './user';
import { UserService } from './user.service';


@Component({
    moduleId: module.id,
    selector: 'user-list',
    templateUrl: 'user-list.component.html'
})
export class UserListComponent {
    @Input() header = "All Users...";

    // when sub is true, it means this list is a one-to-many list.
    // It belongs to a parent entity, as a result the addNew operation
    // must prefill the parent entity. The prefill is not done here, instead we
    // emit an event.
    @Input() sub : boolean;
    @Output() onAddNewClicked = new EventEmitter();

    userToDelete : User;
    displayDeleteDialog : boolean;

    private example : User = null; // used to query by example...

    // list is paginated
    currentPage : PageResponse<User> = new PageResponse<User>(0,0,[]);


    constructor(private router:Router, private userService : UserService, private messageService : MessageService) { }
    loadPage(event : LazyLoadEvent) {
        this.userService.getPage(this.example, event).
            subscribe(
                pageResponse => this.currentPage = pageResponse,
                error => this.messageService.error('Could not get the results', error)
            );
    }

    onRowSelect(event : any) {
        this.router.navigate(['/user', event.data.id]);
    }

    addNew() {
        if (this.sub) {
            this.onAddNewClicked.emit("addNew");
        } else {
            this.router.navigate(['/user', 'new']);
        }
    }

    showDeleteDialog(rowData : any) {
        this.userToDelete = <User> rowData;
        this.displayDeleteDialog = true;
    }

    // delete + remove from current page
    delete() {
        this.userService.delete(this.userToDelete.id).
            subscribe(
                response => {
                    this.currentPage.remove(this.userToDelete);
                    this.displayDeleteDialog = false;
                    this.userToDelete = null;
                    this.messageService.info('Deleted OK', 'We lost another one!');
                },
                error => this.messageService.error('Could not delete!', error)
            );
    }    
}