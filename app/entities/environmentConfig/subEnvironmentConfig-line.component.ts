import {Component, Input} from '@angular/core';
import {SubEnvironmentConfig} from './subEnvironmentConfig';

@Component({
	template: `
        {{ subEnvironmentConfig.parameter }} {{ subEnvironmentConfig.value }} {{ subEnvironmentConfig.hieraAddress }} 	`,
	selector: 'subEnvironmentConfig-line',
})
export class SubEnvironmentConfigLineComponent {
    @Input() subEnvironmentConfig : SubEnvironmentConfig;
}
