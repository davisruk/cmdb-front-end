import {Component, Input} from '@angular/core';
import {Globalconfig} from './globalconfig';

@Component({
	template: `
        {{ globalconfig.parameter }} 	`,
	selector: 'globalconfig-line',
})
export class GlobalconfigLineComponent {
    @Input() globalconfig : Globalconfig;
}
