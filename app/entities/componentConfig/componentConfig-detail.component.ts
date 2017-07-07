import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { MessageService} from '../../service/message.service';
import {ComponentConfig} from './componentConfig';
import {ComponentConfigService} from './componentConfig.service';
import {SolutionComponent} from '../solutionComponent/solutionComponent';
import { SecurityHelper } from '../../support/security-helper';
import { RefreshComponent } from '../../support/refresh.component';
import { FieldValidationTags, HieraTag, HieraRefresh,HieraTagCollection } from '../../support/hiera-tag-support';

// Value accessor that allows sub components to alter 
// this component's model without using emit
export const COMPONENT_CONFIG_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ComponentConfigDetailComponent),
    multi: true
};

@Component({
    moduleId: module.id,
	templateUrl: 'componentConfig-detail.component.html',
	selector: 'componentConfig-detail',
})
export class ComponentConfigDetailComponent implements OnInit, OnDestroy, ControlValueAccessor {
    componentConfig : ComponentConfig;

    private params_subscription: any;
    private allowWriteSensitive: boolean;
    private enableCreateFrom: boolean;
    private invalidHieraTags:FieldValidationTags;
    private displayHieraTags:HieraTagCollection;

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
    ////////////////////////////////////////////////
    //
    //  Value Accessor callbacks for sub components
    //
    ////////////////////////////////////////////////
    
    //Placeholders for the callbacks
    private onTouchedCallback: () => void = () => {};
    private onChangeCallback: (_:any) => void = () => {};
    
    // Control Value Accessor implementation
    get value(): any { return this.componentConfig };
    set value(v: any) {
        this.componentConfig = <ComponentConfig> v;
        this.onChangeCallback(v);
    }

    //Set touched on blur
    onTouched(){
        this.onTouchedCallback();
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        this.componentConfig = <ComponentConfig> value;
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
    
    ////////////////////////////////////////////////
    //
    //  End of Value Accessor callbacks
    //
    ////////////////////////////////////////////////

    ngOnInit() {
        if (this.sub) {
            return;
        }
        //Setup invalid tags for fields
        this.invalidHieraTags = new FieldValidationTags();
        this.invalidHieraTags.paramTags.push(new HieraTag("ParamName", false, false));
        // setup hiera component fields to display
        this.displayHieraTags = new HieraTagCollection();
        this.displayHieraTags.tags.push(new HieraTag(HieraTag.PARAM, false, false));
        this.displayHieraTags.tags.push(new HieraTag(HieraTag.RELEASE, false, false));
        this.displayHieraTags.tags.push(new HieraTag(HieraTag.ENVID, false, false));
        this.displayHieraTags.tags.push(new HieraTag(HieraTag.SUBENV, false, false));

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

    onRefresh(newData: ComponentConfig){
        this.componentConfig = newData;
    }
    
}
