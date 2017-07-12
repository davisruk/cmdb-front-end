import {Component, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { MessageService } from '../service/message.service';
import { FieldValidationTags, HieraTag, HieraRefresh, HieraTagCollection } from "./hiera-tag-support";
import {NgForm} from "@angular/forms";

@Component({
    moduleId: module.id,
    templateUrl: 'hiera-config.component.html',
    selector: 'hiera-config',
})

export class HieraConfigComponent implements OnChanges{
    @Input() validationTags: FieldValidationTags;
    @Input() hieraItem:any;
    @Input() valueDisabled:boolean
    @Input() messageService: MessageService;
    @Input() displayTags: HieraTagCollection;
    
    @ViewChild('hieraForm') currentForm: NgForm;
    
    private gcForm: NgForm;    
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
        this.processDisplayTags();
    }
  
    private processDisplayTags(){
        this.showParamTag = this.displayTags.containsTag(HieraTag.PARAM);
        this.showReleaseTag = this.displayTags.containsTag(HieraTag.RELEASE);
        this.showEnvTag = this.displayTags.containsTag(HieraTag.ENVID);
        this.showSubEnvTag = this.displayTags.containsTag(HieraTag.SUBENV);
        this.showServerTag = this.displayTags.containsTag(HieraTag.SERVER);
        this.showServerTypeTag = this.displayTags.containsTag(HieraTag.SERVER_TYPE);
    }

      ngAfterViewChecked(){
        this.formChanged();
    }

    private formChanged(){
        if (this.currentForm == this.gcForm) {return;}
        this.gcForm = this.currentForm;
        if (this.gcForm){
            this.gcForm.valueChanges.subscribe(data => this.onValueChanged(data));
        }
    }

    private onValueChanged(data?:any){
        if (!this.gcForm) {return;}
        const form = this.gcForm.form;
        for (const field in this.formErrors){
            this.formErrors[field] = '';
            const control = form.get(field);
            //if (control && control.dirty && !control.valid){
            if (control && !control.valid){                
                const messages = this.validationMessages[field];
                for (const key in control.errors){
                    this.formErrors[field] += this.substituteMessageFields(messages[key], field, control.errors[key]) + ' ';
                }
            }
        }
    }

    private substituteMessageFields(message:string, field:string, tag:string):string{
        message = message.replace("{field}", field);
        message = message.replace("{tag}", tag);
        return message;
    }

    formErrors = {
        'parameter': '',
        'hieraAddress': '',
        'value':''
    }

    validationMessages = {
        'parameter':{'required': 'ParamName is required.',
                    'forbiddenTags':'{field} cannot contain {tag}'},
        'hieraAddress':{},
        'value':{}
    }

    // check if the tags to display have changed
    // the parent component will have to set a new reference
    // to the @Input displayTags - changing an internal value
    // is not enough as Angular only checks with === (reference)
    // we could insted use ngDoCheck but this would be grossly
    // inefficient as it would be called many many times
    // it is better to rebuild the small collection in the parent
    // each time.
    ngOnChanges(changes: SimpleChanges) {
        if (changes['displayTags'])
            this.processDisplayTags();
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
//        if(this.tagString) {
//            if (!this.validationTags.tagValidForParams(this.tagString)){
//                this.messageService.error("Incompatible Tag", this.tagString + ' is invalid for Parameter field');
//            }else {
                let tag = new HieraTag(this.tagString, this.tagType == HieraTag.UPPER, this.tagType == HieraTag.LOWER)
                this.hieraItem.parameter = tag.appendTag(this.hieraItem.parameter);
                this.currentForm.controls['parameter'].markAsDirty();
//           }
//        }
    }

    dragEnd(event:any) {
        this.tagString = null;
    }    
}