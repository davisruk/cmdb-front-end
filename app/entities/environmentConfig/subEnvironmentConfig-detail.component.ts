import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { MessageService} from '../../service/message.service';
import {SubEnvironmentConfig} from './subEnvironmentConfig';
import {SubEnvironmentConfigService} from './subEnvironmentConfig.service';
import {SubEnvironment} from '../environment/subEnvironment';
import { SecurityHelper } from '../../support/security-helper';
@Component({
    moduleId: module.id,
	templateUrl: 'subEnvironmentConfig-detail.component.html',
	selector: 'subEnvironmentConfig-detail',
})
export class SubEnvironmentConfigDetailComponent implements OnInit, OnDestroy {
    subEnvironmentConfig : SubEnvironmentConfig;

    private params_subscription: any;
    private envName: string;
    private allowWriteSensitive: boolean;
    private enableCreateFrom: boolean;
    @Input() sub : boolean = false;
    @Input() // used to pass the parent when creating a new SubEnvironmentConfig
    set subEnvironment(subEnvironment : SubEnvironment) {
        this.subEnvironmentConfig = new SubEnvironmentConfig();
        this.subEnvironmentConfig.subEnvironment = subEnvironment;
    }

    @Output() onSaveClicked = new EventEmitter<SubEnvironmentConfig>();
    @Output() onCancelClicked = new EventEmitter();

    constructor(private route: ActivatedRoute, private router: Router, private messageService: MessageService, private subEnvironmentConfigService: SubEnvironmentConfigService) {
    }

    ngOnInit() {
        if (this.sub) {
            return;
        }

        this.params_subscription = this.route.params.subscribe(params => {
            let id = params['id'];
            console.log('ngOnInit for subEnvironmentConfig-detail ' + id);

            if (id === 'new') {
                this.subEnvironmentConfig = new SubEnvironmentConfig();
                this.envName = '';
                this.enableCreateFrom = false;
            } else {
                this.enableCreateFrom = true;
                this.subEnvironmentConfigService.getSubEnvironmentConfig(id)
                    .subscribe(
                        subEnvironmentConfig => {
                            this.subEnvironmentConfig = subEnvironmentConfig;
                            this.envName = this.subEnvironmentConfig.subEnvironment.environment.name;
                        },
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

    gotoSubEnvironment() {
        this.router.navigate(['/subEnv', this.subEnvironmentConfig.subEnvironment.id]);
    }

    clearEnvironment() {
        this.subEnvironmentConfig.subEnvironment = null;
    }

    onSave() {
        this.subEnvironmentConfigService.update(this.subEnvironmentConfig).
            subscribe(
                subEnvironmentConfig => {
                    this.subEnvironmentConfig = subEnvironmentConfig;
                    if (this.sub) {
                        this.onSaveClicked.emit(this.subEnvironmentConfig);
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
        this.subEnvironmentConfig.id = undefined;
        this.enableCreateFrom = false;
    }

}
