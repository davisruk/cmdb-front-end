//
// Source code generated by Celerio, a Jaxio product.
// Documentation: http://www.jaxio.com/documentation/celerio/
// Follow us on twitter: @jaxiosoft
// Need commercial support ? Contact us: info@jaxio.com
// Template pack-angular:src/main/webapp/app/entities/entity.ts.e.vm
//
import {Release} from '../release/release';

export class ReleaseConfig {
    // Raw attributes
    id : number;
    parameter : string;
    value : string;
    hieraAddress : string;
    recursiveByEnv : boolean;
    recursiveBySubEnv : boolean;
    notes: string;
    sensitive : boolean;
    
    // x-to-one
    release : Release;
}
