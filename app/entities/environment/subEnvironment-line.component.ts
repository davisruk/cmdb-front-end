import {Component, Input} from '@angular/core';
import {SubEnvironment} from './subEnvironment';

@Component({
	template: `
        {{ subEnvironment.subEnvironmentType.name }} 	`,
	selector: 'subEnvironment-line',
})
export class SubEnvironmentLineComponent {
    @Input() subEnvironment : SubEnvironment;
}
