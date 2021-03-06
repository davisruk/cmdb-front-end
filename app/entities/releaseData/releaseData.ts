//
// Source code generated by Celerio, a Jaxio product.
// Documentation: http://www.jaxio.com/documentation/celerio/
// Follow us on twitter: @jaxiosoft
// Need commercial support ? Contact us: info@jaxio.com
// Template pack-angular:src/main/webapp/app/entities/entity.ts.e.vm
//
import {Release} from '../release/release';
import {ReleaseDataType} from '../releaseDataType/releaseDataType';

export class ReleaseData {
    // Raw attributes
    param : string;
    value : string;
    id : number;
    // x-to-one
    release : Release;
    dataType : ReleaseDataType;
}
