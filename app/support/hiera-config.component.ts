import {Component, Input, Output, EventEmitter} from '@angular/core';
import { MessageService } from '../service/message.service';
import { FieldValidationTags, HieraTag, HieraRefresh } from "./hiera-tag-support";

@Component({
    moduleId: module.id,
    templateUrl: 'hiera-config.component.html',
    selector: 'hiera-config',
})

export class HieraConfigComponent{
    @Input() disallowedTags: FieldValidationTags;
    @Input() paramName:string;
    @Input() address:string;
    @Input() value:string;
    @Input() valueDisabled:boolean
    @Output() dataRefresh: EventEmitter<HieraRefresh> = new EventEmitter<HieraRefresh>();
    @Input() messageService: MessageService;
    
    private tagString:string;
    private tagType:string;


    ngOnInit() {
        this.tagType = "asIs";
    }

    dragStart(event:any,tag: string) {
        this.tagString = tag;
    }
    
    dropOnAddress(event:any) {
        if(this.tagString) {
            let tag = new HieraTag(this.tagString, this.tagType == 'upper', this.tagType == 'lower')
            this.address = tag.appendTag(this.address);
            this.dataRefresh.emit(new HieraRefresh ("address", this.address));
        }
    }

    onChangeAddress(event:any) {
    this.dataRefresh.emit(new HieraRefresh ("address", this.address));
    }
    
    dropOnValue(event:any) {
        if(this.tagString) {
            let tag = new HieraTag(this.tagString, this.tagType == 'upper', this.tagType == 'lower')
            this.value = tag.appendTag(this.value);
            this.dataRefresh.emit(new HieraRefresh ("value", this.value));            
        }
    }

    dropOnParameter(event:any) {
        if(this.tagString) {
            if (this.tagString == 'ParamName'){
                this.messageService.error("Incompatible Tag", 'ParamName invalid for this field');
            }else {
                let tag = new HieraTag(this.tagString, this.tagType == 'upper', this.tagType == 'lower')
                this.paramName = tag.appendTag(this.paramName);
                this.dataRefresh.emit(new HieraRefresh ("parameter", this.paramName));
            }
        }
    }

    dragEnd(event:any) {
        this.tagString = null;
    }    
}