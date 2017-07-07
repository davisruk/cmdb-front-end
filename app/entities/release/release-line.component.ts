import {Component, Input} from '@angular/core';
import {Release} from './release';

@Component({
	template: `
        {{ release.name }} 	`,
	selector: 'release-line',
})
export class ReleaseLineComponent {
    @Input() release : Release;
}
