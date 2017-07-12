import { Directive, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NG_VALIDATORS, Validator, Validators, ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';

import {FieldValidationTags, HieraTag} from "./hiera-tag-support";

export function forbiddenTagsValidator (tags: HieraTag[]): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
        const val:string = control.value;
        const name:string = getControlName(control);
        var retVal = null;
        var tagsPresent = '';
        if (tags){
            for (var tag of tags){
                if (val && val.includes(tag.tag)){
                    tagsPresent = tagsPresent + tag.tag + ',';
                }
            }
            if (tagsPresent.length > 0){
                retVal = {'forbiddenTags': tagsPresent.slice (0, -1)};
            }
        }

        return retVal;
    }
}

function getControlName(control: AbstractControl):string {
    
    var controlName = null;
    var parent = control.parent;

    // only such parent, which is FormGroup, has a dictionary 
    // with control-names as a key and a form-control as a value
    if (parent instanceof FormGroup)
    {
        // now we will iterate those keys (i.e. names of controls)
        Object.keys(parent.controls).forEach((name) =>
        {
            // and compare the passed control and 
            // a child control of a parent - with provided name (we iterate them all)
            if (control === parent.controls[name])
            {
                // both are same: control passed to Validator
                //  and this child - are the same references
                controlName = name;
            }
        });
    }
    // we either found a name or simply return null
    return controlName;
}

@Directive({
    selector: '[forbiddenTags][ngModel]',
    providers: [{provide: NG_VALIDATORS, useExisting: ForbiddenTagsDirective, multi:true}]
})

export class ForbiddenTagsDirective implements Validator, OnChanges, OnInit{
    @Input() forbiddenTags: HieraTag[];
    private valFn = Validators.nullValidator;
    
    ngOnInit(){
        console.log('ngInit for ForbiddenTags directive');
    }

    ngOnChanges(changes:SimpleChanges):void{
        const change = changes['forbiddenTags'];
        if (change){
            this.valFn = forbiddenTagsValidator(this.forbiddenTags);
        }
    }
    validate(control:AbstractControl): {[key: string]:any}{
        return this.valFn(control);
    }
}