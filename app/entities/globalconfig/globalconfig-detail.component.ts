import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { MessageService} from '../../service/message.service';
import {Globalconfig} from './globalconfig';
import {GlobalconfigService} from './globalconfig.service';
import { SecurityHelper } from '../../support/security-helper';

@Component({
    moduleId: module.id,
	templateUrl: 'globalconfig-detail.component.html',
	selector: 'globalconfig-detail',
})
export class GlobalconfigDetailComponent implements OnInit, OnDestroy {
    globalconfig : Globalconfig;

    private params_subscription: any;
    private allowWriteSensitive: boolean;
    private enableCreateFrom: boolean;

    @Input() sub : boolean = false;
    @Output() onSaveClicked = new EventEmitter<Globalconfig>();
    @Output() onCancelClicked = new EventEmitter();

    constructor(private route: ActivatedRoute, private router: Router, private messageService: MessageService, private globalconfigService: GlobalconfigService) {
    }

    ngOnInit() {
        if (this.sub) {
            return;
        }

        this.params_subscription = this.route.params.subscribe(params => {
            let id = params['id'];
            console.log('ngOnInit for globalconfig-detail ' + id);

            if (id === 'new') {
                this.globalconfig = new Globalconfig().emptyFactory();
                this.enableCreateFrom = false;
            } else {
                this.enableCreateFrom = true;
                this.globalconfigService.getGlobalconfig(id)
                    .subscribe(
                        globalconfig => this.globalconfig = globalconfig,
                        error =>  this.messageService.error('ngOnInit error', error)
                    );
            }
        });

        this.allowWriteSensitive = new SecurityHelper().userHasWriteSensitive();
    }

    ngOnDestroy() {
        if (!this.sub) {
            this.params_subscription.unsubscribe();
        }
    }

    onSave() {
        this.globalconfigService.update(this.globalconfig).
            subscribe(
                globalconfig => {
                    this.globalconfig = globalconfig;
                    if (this.sub) {
                        this.onSaveClicked.emit(this.globalconfig);
                        this.messageService.info('Saved OK and msg emitted', 'PrimeNG Rocks ;-)')
                    } else {
                        this.messageService.info('Saved OK', 'PrimeNG Rocks ;-)')
                    }
                    this.enableCreateFrom = true;                    
                },
                error =>  this.messageService.error('Could not save', error)
            );
    }

    onCancel() {
        if (this.sub) {
            this.onCancelClicked.emit("cancel");
            this.messageService.info('Cancel clicked and msg emitted', 'PrimeNG Rocks ;-)')
        }
    }

    onCreateFrom(){
        this.globalconfig.id = undefined;
        this.enableCreateFrom = false;
    }

 }
