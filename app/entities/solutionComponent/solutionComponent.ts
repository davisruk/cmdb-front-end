import {PackageInfo} from '../packageInfo/packageInfo';
import {BaseEntity} from '../../support/base-entity';

export class SolutionComponent extends BaseEntity{
    // Raw attributes
    id : number;
    name : string;
    // x-to-one
    packageInfo : PackageInfo;
    version: number;

    constructor(){
        super();
        this.name = "";
        this.packageInfo = null;
    }
}
