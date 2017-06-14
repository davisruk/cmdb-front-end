export class Globalconfig {
    // Raw attributes
    id? : number;
    parameter? : string;
    value? : string;
    hieraAddress? : string;
    recursiveByEnv? : boolean;
    recursiveByRel? : boolean;
    recursiveBySubEnv? : boolean;
    notes?: string;
    sensitive? : boolean;
    arrayItem?: boolean;

    constructor()
    constructor(parameter:string)
    constructor(parameter?:string){
        this.parameter = parameter;
    }

    emptyFactory():Globalconfig{
        let retVal:Globalconfig = new Globalconfig();
        retVal.parameter = "";
        retVal.value = "";
        retVal.hieraAddress = "";
        retVal.recursiveByEnv = false;
        retVal.recursiveBySubEnv = false;
        retVal.recursiveByRel = false;
        retVal.notes = "";
        retVal.sensitive = false;
        retVal.arrayItem = false;
        return retVal;
    }

    searchByExampleWithValueFactory(value:string):Globalconfig{
        let retVal:Globalconfig = new Globalconfig();
        retVal.value = value;
        return retVal;
    }

    searchByExampleWithAddressFactory(address:string):Globalconfig{
        let retVal:Globalconfig = new Globalconfig();
        retVal.hieraAddress = address;
        return retVal;
    }
    
}
