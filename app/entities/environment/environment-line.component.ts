import {Component, Input} from '@angular/core';
import {Environment} from './environment';

@Component({
	template: `
        {{ environment.name }} 	`,
	selector: 'environment-line',
})
export class EnvironmentLineComponent {
    @Input() environment : Environment;
}
