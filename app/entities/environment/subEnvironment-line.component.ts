import {Component, Input} from '@angular/core';
import {SubEnvironment} from './subEnvironment';

@Component({
	template: `
        {{ subEnvironment.name }} 	`,
	selector: 'subEnvironment-line',
})
export class SubEnvironmentLineComponent {
    @Input() subEnvironment : SubEnvironment;
}
