import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { MessageService} from '../../service/message.service';
import {ComponentConfig} from './componentConfig';
import {ComponentConfigService} from './componentConfig.service';
import {SolutionComponent} from '../solutionComponent/solutionComponent';
import { SecurityHelper } from '../../support/security-helper';

@Component({
    moduleId: module.id,
	templateUrl: 'componentConfig-detail.component.html',
	selector: 'componentConfig-detail',
})
export class ComponentConfigDetailComponent implements OnInit, OnDestroy {
    componentConfig : ComponentConfig;

    private params_subscription: any;
    private allowWriteSensitive: boolean;
    private enableCreateFrom: boolean;

    @Input() sub : boolean = false;
    @Input() // used to pass the parent when creating a new ComponentConfig
    set my_component(my_component : SolutionComponent) {
        this.componentConfig = new ComponentConfig();
        this.componentConfig.my_component = my_component;
    }

    @Output() onSaveClicked = new EventEmitter<ComponentConfig>();
    @Output() onCancelClicked = new EventEmitter();

    constructor(private route: ActivatedRoute, private router: Router, private messageService: MessageService, private componentConfigService: ComponentConfigService) {
    }

    ngOnInit() {
        if (this.sub) {
            return;
        }

        this.params_subscription = this.route.params.subscribe(params => {
            let id = params['id'];
            console.log('ngOnInit for componentConfig-detail ' + id);

            if (id === 'new') {
                this.componentConfig = new ComponentConfig();
                this.enableCreateFrom = false;
            } else {
                this.enableCreateFrom = true;
                this.componentConfigService.getComponentConfig(id)
                    .subscribe(
                        componentConfig => this.componentConfig = componentConfig,
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

    gotoMy_component() {
        this.router.navigate(['/solutionComponent', this.componentConfig.my_component.id]);
    }

    clearMy_component() {
        this.componentConfig.my_component = null;
    }

    onSave() {
        this.componentConfigService.update(this.componentConfig).
            subscribe(
                componentConfig => {
                    this.componentConfig = componentConfig;
                    if (this.sub) {
                        this.onSaveClicked.emit(this.componentConfig);
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
        this.componentConfig.id = undefined;
        this.enableCreateFrom = false;
    }
}
