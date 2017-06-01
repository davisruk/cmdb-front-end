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

    constructor()
    constructor(parameter:string)
    constructor(parameter?:string){
        this.parameter = parameter;
    }

    emptyFactory():Globalconfig{
        let retVal:Globalconfig = new Globalconfig();
        this.parameter = "";
        this.value = "";
        this.hieraAddress = "";
        this.recursiveByEnv = false;
        this.recursiveBySubEnv = false;
        this.recursiveByRel = false;
        this.notes = "";
        this.sensitive = false;
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
