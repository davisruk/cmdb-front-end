import {Component, Input, Output, EventEmitter} from '@angular/core';
import { MessageService } from '../service/message.service';
import { FieldValidationTags, HieraTag, HieraRefresh, HieraTagCollection } from "./hiera-tag-support";

@Component({
    moduleId: module.id,
    templateUrl: 'hiera-config.component.html',
    selector: 'hiera-config',
})

export class HieraConfigComponent{
    @Input() validationTags: FieldValidationTags;
    @Input() hieraItem:any;
    @Input() valueDisabled:boolean
    @Input() messageService: MessageService;
    @Input() displayTags: HieraTagCollection;
    
    private tagString:string;
    private tagType:string;
    private showParamTag:boolean;
    private showReleaseTag:boolean;
    private showEnvTag:boolean;
    private showSubEnvTag:boolean;
    private showServerTag:boolean;
    private showServerTypeTag:boolean;


    ngOnInit() {
        this.tagType = HieraTag.AS_IS;
        this.showParamTag = this.displayTags.containsTag(HieraTag.PARAM);
        this.showReleaseTag = this.displayTags.containsTag(HieraTag.RELEASE);
        this.showEnvTag = this.displayTags.containsTag(HieraTag.ENVID);
        this.showSubEnvTag = this.displayTags.containsTag(HieraTag.SUBENV);
        this.showServerTag = this.displayTags.containsTag(HieraTag.SERVER);
        this.showServerTypeTag = this.displayTags.containsTag(HieraTag.SERVER_TYPE);
    }

    dragStart(event:any,tag: string) {
        this.tagString = tag;
    }
    
    dropOnAddress(event:any) {
        if(this.tagString) {
            if (!this.validationTags.tagValidForValue(this.tagString)){
                this.messageService.error("Incompatible Tag", this.tagString + ' is invalid for Address field');
            }else {
                let tag = new HieraTag(this.tagString, this.tagType == HieraTag.UPPER, this.tagType == HieraTag.LOWER)
                this.hieraItem.hieraAddress = tag.appendTag(this.hieraItem.hieraAddress);
            }
        }
    }

    dropOnValue(event:any) {
        if (this.valueDisabled)
            return;
        if(this.tagString) {
            if (!this.validationTags.tagValidForValue(this.tagString)){
                this.messageService.error("Incompatible Tag", this.tagString + ' is invalid for Value field');
            }else {
                let tag = new HieraTag(this.tagString, this.tagType == HieraTag.UPPER, this.tagType == HieraTag.LOWER)
                this.hieraItem.value = tag.appendTag(this.hieraItem.value);
            }
        }
    }

    dropOnParameter(event:any) {
        if(this.tagString) {
            if (!this.validationTags.tagValidForParams(this.tagString)){
                this.messageService.error("Incompatible Tag", this.tagString + ' is invalid for Parameter field');
            }else {
                let tag = new HieraTag(this.tagString, this.tagType == HieraTag.UPPER, this.tagType == HieraTag.LOWER)
                this.hieraItem.parameter = tag.appendTag(this.hieraItem.parameter);
            }
        }
    }

    dragEnd(event:any) {
        this.tagString = null;
    }    
}