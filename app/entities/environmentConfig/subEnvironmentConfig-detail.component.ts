import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { MessageService} from '../../service/message.service';
import {SubEnvironmentConfig} from './subEnvironmentConfig';
import {SubEnvironmentConfigService} from './subEnvironmentConfig.service';
import {SubEnvironment, SubEnvironmentType} from '../environment/subEnvironment';
import {EnvironmentService} from '../environment/environment.service';
import {Environment} from '../environment/environment';
import { SecurityHelper } from '../../support/security-helper';
import { FieldValidationTags, HieraTag, HieraRefresh,HieraTagCollection } from '../../support/hiera-tag-support';

// Value accessor that allows sub components to alter 
// this component's model without using emit
export const RELEASE_CONFIG_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SubEnvironmentConfigDetailComponent),
    multi: true
};

@Component({
    moduleId: module.id,
	templateUrl: 'subEnvironmentConfig-detail.component.html',
	selector: 'subEnvironmentConfig-detail',
})
export class SubEnvironmentConfigDetailComponent implements OnInit, OnDestroy{
    subEnvironmentConfig : SubEnvironmentConfig;

    private params_subscription: any;
    private envName: string;
    private allowWriteSensitive: boolean;
    private enableCreateFrom: boolean;
    private subEnvTypes : SubEnvironmentType[]; // model array to use with subenv list
    private selectedSubEnvType : string;
    private listSubEnvTypes : SelectItem[]; // list array for subenv items
    private env: Environment;
    private invalidHieraTags:FieldValidationTags;
    private displayHieraTags:HieraTagCollection;
    
    @Input() sub : boolean = false;
    @Input() // used to pass the parent when creating a new SubEnvironmentConfig
    set subEnvironment(subEnvironment : SubEnvironment) {
        this.subEnvironmentConfig = new SubEnvironmentConfig();
        this.subEnvironmentConfig.subEnvironment = subEnvironment;
    }

    @Output() onSaveClicked = new EventEmitter<SubEnvironmentConfig>();
    @Output() onCancelClicked = new EventEmitter();

    constructor(private route: ActivatedRoute,
                private router: Router,
                private messageService: MessageService,
                private subEnvironmentConfigService: SubEnvironmentConfigService,
                private environmentService: EnvironmentService) {
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
    get value(): any { return this.subEnvironmentConfig };
    set value(v: any) {
        this.subEnvironmentConfig = <SubEnvironmentConfig> v;
        this.onChangeCallback(v);
    }

    //Set touched on blur
    onTouched(){
        this.onTouchedCallback();
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        this.subEnvironmentConfig = <SubEnvironmentConfig> value;
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

    onEnvChange(newEnv:Environment) {
        // callback that notifies a model change on the <environment-auto-complete> component
        this.getSubEnvTypes(this.env);            
        this.selectedSubEnvType = this.subEnvTypes[0].name;
    }

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
            this.listSubEnvTypes = new Array();
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
                            this.environmentService.getEnvironment(this.subEnvironmentConfig.subEnvironment.environment.id)
                                .subscribe(environment => {
                                    this.env = environment;
                                    this.getSubEnvTypes(this.env);
                                });
                        },
                        error =>  this.messageService.error('ngOnInit error', error)
                    );
            }
        });
        
        this.allowWriteSensitive = new SecurityHelper().userHasWriteSensitive();
    }

    getSubEnvTypes(env:Environment){
        this.subEnvTypes = new Array();
        this.listSubEnvTypes = new Array();
        env.subEnvironments.forEach(element => {
            this.listSubEnvTypes.push(({label: element.subEnvironmentType.name, value:element.subEnvironmentType.name}));
            this.subEnvTypes.push(element.subEnvironmentType);
        });
        if (this.subEnvironmentConfig.subEnvironment == undefined){
            this.subEnvironmentConfig.subEnvironment = env.subEnvironments[0];
        }
        this.selectedSubEnvType = "" + this.subEnvironmentConfig.subEnvironment.subEnvironmentType.name;
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
        this.subEnvironmentConfig.subEnvironment = this.env.subEnvironments.find(this.checkSubEnvType, this);
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

    checkSubEnvType(currentValue:SubEnvironment, ):boolean{
        return currentValue.subEnvironmentType.name == this.selectedSubEnvType;
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

    onRefresh(newData: SubEnvironmentConfig){
        this.subEnvironmentConfig = newData;
    }
}
