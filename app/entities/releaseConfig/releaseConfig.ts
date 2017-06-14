import {Release} from '../release/release';

export class ReleaseConfig {
    // Raw attributes
    id? : number;
    parameter? : string;
    value? : string;
    hieraAddress? : string;
    recursiveByEnv? : boolean;
    recursiveBySubEnv? : boolean;
    notes?: string;
    sensitive? : boolean;
    arrayItem?: boolean;
    
    // x-to-one
    release? : Release;

    constructor(name?:string){
        if (name != undefined){
            this.release = new Release();
            this.release.name = name;
        }
    }

    emptyFactory():ReleaseConfig{
        let retVal:ReleaseConfig = new ReleaseConfig();
        retVal.hieraAddress = "";
        retVal.parameter = "";
        retVal.value = "";
        retVal.hieraAddress = "";
        retVal.recursiveByEnv = false;
        retVal.recursiveBySubEnv = false;
        retVal.notes = "";
        retVal.sensitive = false;
        retVal.release = null;
        retVal.arrayItem = false;
        return retVal;
    }

    searchByExampleWithNameFactory(name:string):ReleaseConfig {
        let retVal:ReleaseConfig = new ReleaseConfig(name);
        return retVal;
    }

    searchByExampleWithParameterFactory(parameter:string):ReleaseConfig {
        let retVal:ReleaseConfig = new ReleaseConfig(null);
        retVal.parameter = parameter;
        return retVal;
    }
    
}
