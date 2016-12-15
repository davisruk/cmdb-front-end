import {Component, Input, Output, EventEmitter, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {AutoCompleteModule} from 'primeng/primeng';
import {MessageService} from '../../service/message.service';
import {SubEnvironmentConfig} from './subEnvironmentConfig';
import {SubEnvironmentConfigService} from './subEnvironmentConfig.service';

// Resource: http://almerosteyn.com/2016/04/linkup-custom-control-to-ngcontrol-ngmodel

export const SUBENVIRONMENTCONFIG_AUTO_COMPLETE_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SubEnvironmentConfigCompleteComponent),
    multi: true
};

@Component({
	template: `
        <p-autoComplete [(ngModel)]="value" [minLength]="1" [disabled]="disabled" placeholder="Hint: type to search..." field="parameter" [suggestions]="suggestions" (completeMethod)="complete($event)" (onSelect)="select($event)">
            <template let-subEnvironmentConfig>
                <subEnvironmentConfig-line [subEnvironmentConfig]="subEnvironmentConfig"></subEnvironmentConfig-line>
            </template>
        </p-autoComplete>
	`,
	selector: 'subEnvironmentConfig-auto-complete',
    providers: [SUBENVIRONMENTCONFIG_AUTO_COMPLETE_CONTROL_VALUE_ACCESSOR]
})
export class SubEnvironmentConfigCompleteComponent implements ControlValueAccessor {
    @Input() disabled : boolean = false;
    @Input() id : string;
    @Input() name : string;

    //The internal data model
    private _value: SubEnvironmentConfig = null;

    private suggestions : SubEnvironmentConfig[] = [];

    //Placeholders for the callbacks
    private _onTouchedCallback: () => void = () => {};
    private _onChangeCallback: (_:any) => void = () => {};

    constructor(private subEnvironmentConfigService : SubEnvironmentConfigService, private messageService : MessageService) {
    }

    @Input()
    get value(): any { return this._value; };

    //set accessor including call the onchange callback
    set value(v: any) {
        if (this._value != null && (v == null || v == "")) {
            this.select(null);
        }
        // nop, see writeValue and select method
    }

    //Set touched on blur
    onTouched(){
        this._onTouchedCallback();
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        this._value = <SubEnvironmentConfig> value;
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this._onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this._onTouchedCallback = fn;
    }

    //From ControlValueAccessor interface
    setDisabledState(isDisabled: boolean) {
    }

    complete(event:any) {
        this.subEnvironmentConfigService.complete(event.query).
            subscribe(
                results => this.suggestions = results,
                error => this.messageService.error(error, 'Error during auto-complete')
            );
    }

    select(v : any) {
        this._value = v;
        this._onChangeCallback(v);
    }
}
