import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, forwardRef, ViewChild} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { MessageService} from '../../service/message.service';
import {Globalconfig} from './globalconfig';
import {GlobalconfigService} from './globalconfig.service';
import {SecurityHelper } from '../../support/security-helper';
import {FieldValidationTags, HieraTag, HieraRefresh,HieraTagCollection} from '../../support/hiera-tag-support';
import {HieraConfigComponent} from '../../support/hiera-config.component';


// Value accessor that allows sub components to alter 
// this component's model without using emit
export const GLOBAL_CONFIG_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => GlobalconfigDetailComponent),
    multi: true
};

@Component({
    moduleId: module.id,
	templateUrl: 'globalconfig-detail.component.html',
	selector: 'globalconfig-detail',
})
export class GlobalconfigDetailComponent implements OnInit, OnDestroy, ControlValueAccessor{
    globalconfig : Globalconfig;

    private params_subscription: any;
    private allowWriteSensitive: boolean;
    private enableCreateFrom: boolean;
    private invalidHieraTags:FieldValidationTags;
    private displayHieraTags:HieraTagCollection;

    @Input() sub : boolean = false;
    @Output() onSaveClicked = new EventEmitter<Globalconfig>();
    @Output() onCancelClicked = new EventEmitter();
    @ViewChild(HieraConfigComponent) hc: HieraConfigComponent;
    
    constructor(private route: ActivatedRoute, private router: Router, private messageService: MessageService, private globalconfigService: GlobalconfigService) {
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
    get value(): any { return this.globalconfig };
    set value(v: any) {
        this.globalconfig = <Globalconfig> v;
        this.onChangeCallback(v);
    }

    //Set touched on blur
    onTouched(){
        this.onTouchedCallback();
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        this.globalconfig = <Globalconfig> value;
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
        this.invalidHieraTags.paramTags.push(new HieraTag(HieraTag.PARAM, false, false));
        this.params_subscription = this.route.params.subscribe(params => {
            let id = params['id'];
            console.log('ngOnInit for globalconfig-detail ' + id);

            if (id === 'new') {
                this.globalconfig = new Globalconfig().emptyFactory();
                this.enableCreateFrom = false;
                // setup hiera component fields to display
                this.buildHieraTags();
            } else {
                this.enableCreateFrom = true;
                this.globalconfigService.getGlobalconfig(id)
                    .subscribe(
                        globalconfig => {
                            this.globalconfig = globalconfig;
                            // setup hiera component fields to display
                            this.buildHieraTags();

                        },
                        error =>  this.messageService.error('ngOnInit error', error)
                    );
            }
        });
        this.allowWriteSensitive = new SecurityHelper().userHasWriteSensitive();
    }

    private buildHieraTags (){
        // this is actually quicker than using ngDoCheck in hiera-config.component
        // ngOnChange will detect a reference change but not a change to the
        // internal array. ngDoCheck is called constantly so it's best to build
        // the array each time.
        this.displayHieraTags = new HieraTagCollection();
        this.displayHieraTags.addTag(new HieraTag(HieraTag.PARAM, false, false));
        if (this.globalconfig.recursiveByRel)
            this.displayHieraTags.addTag(new HieraTag(HieraTag.RELEASE, false, false));
        if (this.globalconfig.recursiveByEnv)
            this.displayHieraTags.addTag(new HieraTag(HieraTag.ENVID, false, false));
        if (this.globalconfig.recursiveBySubEnv)
            this.displayHieraTags.addTag(new HieraTag(HieraTag.SUBENV, false, false));

        // now build the validationTags
        //Setup invalid tags for fields
        this.invalidHieraTags = new FieldValidationTags();
        this.invalidHieraTags.paramTags.push(new HieraTag(HieraTag.PARAM, false, false));
        if (!this.globalconfig.recursiveByEnv){
            this.invalidHieraTags.paramTags.push(new HieraTag(HieraTag.ENVID, false, false));
            this.invalidHieraTags.valueTags.push(new HieraTag(HieraTag.ENVID, false, false));
            this.invalidHieraTags.addressTags.push(new HieraTag(HieraTag.ENVID, false, false));
        }
        if (!this.globalconfig.recursiveBySubEnv){
            this.invalidHieraTags.paramTags.push(new HieraTag(HieraTag.SUBENV, false, false));
            this.invalidHieraTags.valueTags.push(new HieraTag(HieraTag.SUBENV, false, false));
            this.invalidHieraTags.addressTags.push(new HieraTag(HieraTag.SUBENV, false, false));
        }
        if (!this.globalconfig.recursiveByRel){
            this.invalidHieraTags.paramTags.push(new HieraTag(HieraTag.RELEASE, false, false));
            this.invalidHieraTags.valueTags.push(new HieraTag(HieraTag.RELEASE, false, false));
            this.invalidHieraTags.addressTags.push(new HieraTag(HieraTag.RELEASE, false, false));
        }
    }

    private handleSwitchChange(e:any) {
        this.buildHieraTags();
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
