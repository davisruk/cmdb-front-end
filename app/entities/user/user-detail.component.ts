import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { MessageService} from '../../service/message.service';
import {User} from './user';
import {UserService} from './user.service';
import {RoleService} from '../role/role.service';
import {Role} from '../role/role';

@Component({
    moduleId: module.id,
	templateUrl: 'user-detail.component.html',
	selector: 'user-detail',
})
export class UserDetailComponent implements OnInit, OnDestroy {
    user : User;

    private params_subscription: any;
    uploadedFiles: any[] = [];
    assignedRoles: Role[];
    
    availableRoles: Role[];
    serverPath:string = 'http://localhost:8080/api/users/photoUpload';
    @Input() sub : boolean = false;
    @Output() onSaveClicked = new EventEmitter<User>();
    @Output() onCancelClicked = new EventEmitter();

    constructor(private route: ActivatedRoute, private router: Router, private messageService: MessageService, private userService: UserService, private roleService: RoleService) {
    }

    ngOnInit() {
        if (this.sub) {
            return;
        }

        this.params_subscription = this.route.params.subscribe(params => {
            let id = params['id'];
            console.log('ngOnInit for user-detail ' + id);

            if (id === 'new') {
                this.user = new User();
            } else {
                this.userService.getUser(id)
                    .subscribe(
                        user => {this.user = user;
                                 this.roleService.getUnassignedRolesForUser(this.user).subscribe(p => this.availableRoles = p);
                        },
                        error =>  this.messageService.error('ngOnInit error', error)
                    );
            }
        });
    }

    ngOnDestroy() {
        if (!this.sub) {
            this.params_subscription.unsubscribe();
        }
    }

    onSave() {
        this.userService.update(this.user).
            subscribe(
                user => {
                    this.user = user;
                    if (this.sub) {
                        this.onSaveClicked.emit(this.user);
                        this.messageService.info('Saved OK and msg emitted', 'One more on the list!')
                    } else {
                        this.messageService.info('Saved OK', 'One more on the list!')
                    }
                },
                error =>  this.messageService.error('Could not save', error)
            );
    }

    onCancel() {
        if (this.sub) {
            this.onCancelClicked.emit("cancel");
            this.messageService.info('Cancel clicked and msg emitted', 'Something wrong with that one bud?')
        }
    }

    onBeforeUpload(event:any){
        let xhr:XMLHttpRequest = event.xhr;
        xhr.setRequestHeader('Authorization', localStorage.getItem('JWTToken'));
    }

    onUpload(event:any) {
        for(let file of event.files) {
            this.uploadedFiles.push(file);
        }
    }    
}
