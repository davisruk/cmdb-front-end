import {PackageInfo} from '../packageInfo/packageInfo';

export class SolutionComponent {
    // Raw attributes
    id : number;
    name : string;
    // x-to-one
    packageInfo : PackageInfo;
    version: number;

    constructor(){
        this.version = 0;
        this.name = "";
        this.packageInfo = null;
    }
}
