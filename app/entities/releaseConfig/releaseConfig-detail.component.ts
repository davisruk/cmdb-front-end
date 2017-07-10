import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { MessageService} from '../../service/message.service';
import {ReleaseConfig} from './releaseConfig';
import {ReleaseConfigService} from './releaseConfig.service';
import {Release} from '../release/release';
import { SecurityHelper } from '../../support/security-helper';
import { FieldValidationTags, HieraTag, HieraRefresh,HieraTagCollection } from '../../support/hiera-tag-support';

// Value accessor that allows sub components to alter 
// this component's model without using emit
export const RELEASE_CONFIG_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ReleaseConfigDetailComponent),
    multi: true
};

@Component({
    moduleId: module.id,
	templateUrl: 'releaseConfig-detail.component.html',
	selector: 'releaseConfig-detail',
})
export class ReleaseConfigDetailComponent implements OnInit, OnDestroy, ControlValueAccessor {
    
    @Input() sub : boolean = false;
    @Input() // used to pass the parent when creating a new ReleaseConfig
    set release(release : Release) {
        this.releaseConfig = new ReleaseConfig().emptyFactory();
        this.releaseConfig.release = release;
    }

    @Output() onSaveClicked = new EventEmitter<ReleaseConfig>();
    @Output() onCancelClicked = new EventEmitter();

    private releaseConfig : ReleaseConfig;
    private params_subscription: any;
    private allowWriteSensitive: boolean;
    private enableCreateFrom: boolean;
    private invalidHieraTags:FieldValidationTags;
    private displayHieraTags:HieraTagCollection;

    constructor(private route: ActivatedRoute, private router: Router, private messageService: MessageService, private releaseConfigService: ReleaseConfigService) {
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
    get value(): any { return this.releaseConfig };
    set value(v: any) {
        this.releaseConfig = <ReleaseConfig> v;
        this.onChangeCallback(v);
    }

    //Set touched on blur
    onTouched(){
        this.onTouchedCallback();
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        this.releaseConfig = <ReleaseConfig> value;
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

        this.params_subscription = this.route.params.subscribe(params => {
            let id = params['id'];
            console.log('ngOnInit for releaseConfig-detail ' + id);

            if (id === 'new') {
                this.releaseConfig = new ReleaseConfig().emptyFactory();
                this.enableCreateFrom = false;
                this.buildHieraTags();
            } else {
                this.enableCreateFrom = true;                
                this.releaseConfigService.getReleaseConfig(id)
                    .subscribe(
                        releaseConfig => {
                            this.releaseConfig = releaseConfig;
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
        this.displayHieraTags.addTag(new HieraTag(HieraTag.RELEASE, false, false));
        if (this.releaseConfig.recursiveByEnv)
            this.displayHieraTags.addTag(new HieraTag(HieraTag.ENVID, false, false));
        if (this.releaseConfig.recursiveBySubEnv)
            this.displayHieraTags.addTag(new HieraTag(HieraTag.SUBENV, false, false));
    }

    private handleSwitchChange(e:any) {
        this.buildHieraTags();
    }

    ngOnDestroy() {
        if (!this.sub) {
            this.params_subscription.unsubscribe();
        }
    }

    gotoRelease() {
        this.router.navigate(['/release', this.releaseConfig.release.id]);
    }

    clearRelease() {
        this.releaseConfig.release = null;
    }

    onSave() {
        this.releaseConfigService.update(this.releaseConfig).
            subscribe(
                releaseConfig => {
                    this.releaseConfig = releaseConfig;
                    if (this.sub) {
                        this.onSaveClicked.emit(this.releaseConfig);
                        this.messageService.info('Saved OK and msg emitted', 'PrimeNG Rocks ;-)')
                    } else {
                        this.messageService.info('Saved OK', 'PrimeNG Rocks ;-)');
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
        this.releaseConfig.id = undefined;
        this.enableCreateFrom = false;
    }
}
