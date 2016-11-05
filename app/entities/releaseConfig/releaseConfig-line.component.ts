//
// Source code generated by Celerio, a Jaxio product.
// Documentation: http://www.jaxio.com/documentation/celerio/
// Follow us on twitter: @jaxiosoft
// Need commercial support ? Contact us: info@jaxio.com
// Template pack-angular:src/main/webapp/app/entities/entity-line.component.ts.e.vm
//
import {Component, Input} from '@angular/core';
import {ReleaseConfig} from './releaseConfig';

@Component({
	template: `
        {{ releaseConfig.parameter }} {{ releaseConfig.value }} {{ releaseConfig.hieraAddress }} 	`,
	selector: 'releaseConfig-line',
})
export class ReleaseConfigLineComponent {
    @Input() releaseConfig : ReleaseConfig;
}