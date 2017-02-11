import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { MessageService} from '../../service/message.service';
import {Role} from './role';
import {Privilege} from './privilege';
import {RoleService} from './role.service';

@Component({
    moduleId: module.id,
	templateUrl: 'role-detail.component.html',
	selector: 'role-detail',
})
export class RoleDetailComponent implements OnInit, OnDestroy {
    role : Role;

    private params_subscription: any;
    private availablePrivileges: Privilege[];

    @Input() sub : boolean = false;
    @Output() onSaveClicked = new EventEmitter<Role>();
    @Output() onCancelClicked = new EventEmitter();

    constructor(private route: ActivatedRoute, private router: Router, private messageService: MessageService, private roleService: RoleService) {
    }

    ngOnInit() {
        if (this.sub) {
            return;
        }

        this.params_subscription = this.route.params.subscribe(params => {
            let id = params['id'];
            console.log('ngOnInit for role-detail ' + id);

            if (id === 'new') {
                this.role = new Role();
                this.roleService.getAllPrivileges().subscribe(p=>this.availablePrivileges = p);
                this.role.privileges = new Array<Privilege>();                
            } else {
                this.roleService.getRole(id)
                    .subscribe(
                        role => {
                            this.role = role,
                            this.roleService.getUnassignedPrivilegesForRole(this.role).subscribe(p => this.availablePrivileges = p)
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
        this.roleService.update(this.role).
            subscribe(
                role => {
                    this.role = role;
                    if (this.sub) {
                        this.onSaveClicked.emit(this.role);
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
}
