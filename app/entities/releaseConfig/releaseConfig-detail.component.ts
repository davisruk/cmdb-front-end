import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { MessageService} from '../../service/message.service';
import {ReleaseConfig} from './releaseConfig';
import {ReleaseConfigService} from './releaseConfig.service';
import {Release} from '../release/release';
import { SecurityHelper } from '../../support/security-helper';
import { FieldValidationTags, HieraTag, HieraRefresh } from '../../support/hiera-tag-support';


@Component({
    moduleId: module.id,
	templateUrl: 'releaseConfig-detail.component.html',
	selector: 'releaseConfig-detail',
})
export class ReleaseConfigDetailComponent implements OnInit, OnDestroy {
    releaseConfig : ReleaseConfig;

    private params_subscription: any;
    private allowWriteSensitive: boolean;
    private enableCreateFrom: boolean;
    private tagType:string;
    private tagString:string;

    @Input() sub : boolean = false;
    @Input() // used to pass the parent when creating a new ReleaseConfig
    set release(release : Release) {
        this.releaseConfig = new ReleaseConfig().emptyFactory();
        this.releaseConfig.release = release;
    }

    @Output() onSaveClicked = new EventEmitter<ReleaseConfig>();
    @Output() onCancelClicked = new EventEmitter();

    invalidHieraTags:FieldValidationTags;

    constructor(private route: ActivatedRoute, private router: Router, private messageService: MessageService, private releaseConfigService: ReleaseConfigService) {
    }

    ngOnInit() {
        if (this.sub) {
            return;
        }

        /*
        Hiera Component Experiment
        */
        this.invalidHieraTags = new FieldValidationTags();
        this.invalidHieraTags.paramTags.push(new HieraTag("ParamName", false, false));
        /*
        End of Experiment
        */
        this.tagType = "asIs";
        this.params_subscription = this.route.params.subscribe(params => {
            let id = params['id'];
            console.log('ngOnInit for releaseConfig-detail ' + id);

            if (id === 'new') {
                this.releaseConfig = new ReleaseConfig().emptyFactory();
                this.enableCreateFrom = false;
            } else {
                this.enableCreateFrom = true;                
                this.releaseConfigService.getReleaseConfig(id)
                    .subscribe(
                        releaseConfig => this.releaseConfig = releaseConfig,
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

    dragStart(event:any,tag: string) {
        this.tagString = tag;
    }
    
    dropOnAddress(event:any) {
        if(this.tagString) {
            let tag = new HieraTag(this.tagString, this.tagType == 'upper', this.tagType == 'lower')
            this.releaseConfig.hieraAddress = tag.appendTag(this.releaseConfig.hieraAddress);
        }
    }
    
    dropOnValue(event:any) {
        if(this.tagString) {
            let tag = new HieraTag(this.tagString, this.tagType == 'upper', this.tagType == 'lower')
            this.releaseConfig.value = tag.appendTag(this.releaseConfig.value);
        }
    }

    dropOnParameter(event:any) {
        if(this.tagString) {
            if (this.tagString == 'ParamName'){
                this.messageService.error("Incompatible Tag", 'ParamName invalid for this field');
            }else {
                let tag = new HieraTag(this.tagString, this.tagType == 'upper', this.tagType == 'lower')
                this.releaseConfig.parameter = tag.appendTag(this.releaseConfig.parameter);
            }
        }
    }

    dragEnd(event:any) {
        this.tagString = null;
    }

    onRefreshHieraField(newData: HieraRefresh){
        if (newData.fieldRefreshed == "parameter")
            this.releaseConfig.parameter = newData.fieldValue;
        if (newData.fieldRefreshed == "value")
            this.releaseConfig.value = newData.fieldValue;
        if (newData.fieldRefreshed == "address")
            this.releaseConfig.hieraAddress = newData.fieldValue;
            
    }    
}
