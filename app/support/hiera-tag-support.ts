export class HieraTag {
    static readonly UPPER = "upper";
    static readonly LOWER = "lower";
    static readonly AS_IS = "asIs";
    static readonly PARAM = "ParamName";
    static readonly ENVID = "ENVID";
    static readonly SUBENV = "SubEnvType";
    static readonly RELEASE = "Release";
    static readonly SERVER = "ServerName";
    static readonly SERVER_TYPE = "ServType";

    tag:string;
    isUpper:boolean;
    isLower:boolean;

    constructor(tag:string, upper:boolean, lower:boolean ){
        this.tag = tag;
        this.isUpper = upper;
        this.isLower = lower;
    }

    appendTag(appendTo:string):string{
        let retVal:string=appendTo + ':';
        let delimiters:HieraDelimiters = new HieraDelimiters();
        if (this.isUpper){
            retVal += delimiters.getStartDelimiter(true, false);
            retVal += this.tag;
            retVal += delimiters.getEndDelimiter(true, false);
        }else if (this.isLower){
            retVal += delimiters.getStartDelimiter(false, true);
            retVal += this.tag;
            retVal += delimiters.getEndDelimiter(false, true);
        } else {
            retVal += delimiters.getStartDelimiter(false, false);
            retVal += this.tag;
            retVal += delimiters.getEndDelimiter(false, false);
        }
        return retVal;
    }
}

export class HieraDelimiters {
    upperDelimiters:HieraDelimiter[];
    lowerDelimiters:HieraDelimiter[];
    asIsDelimiters:HieraDelimiter[];

    constructor(){
        this.upperDelimiters = new Array();
        this.lowerDelimiters = new Array();
        this.asIsDelimiters = new Array();
        this.upperDelimiters.push(new HieraDelimiter('[', true));
        this.upperDelimiters.push(new HieraDelimiter(']', false));
        this.lowerDelimiters.push(new HieraDelimiter('<', true));
        this.lowerDelimiters.push(new HieraDelimiter('>', false));
        this.asIsDelimiters.push(new HieraDelimiter('{', true));
        this.asIsDelimiters.push(new HieraDelimiter('}', false));
    }
    
    public getStartDelimiter(upper:boolean, lower:boolean):string{
        let startDelim = '';
        if (upper) {
            return this.findDelimiter(this.upperDelimiters, true);
        } else if (lower) {
            return this.findDelimiter(this.lowerDelimiters, true);
        } else {
            return this.findDelimiter(this.asIsDelimiters, true);
        }
    }

    public getEndDelimiter(upper:boolean, lower:boolean):string{
        let EndDelim = '';
        if (upper) {
            return this.findDelimiter(this.upperDelimiters, false);
        } else if (lower){
            return this.findDelimiter(this.lowerDelimiters, false);
        } else {
            return this.findDelimiter(this.asIsDelimiters, false);
        }
    }

    private findDelimiter (delimiters:HieraDelimiter[], start:boolean):string{
        let i = 0;
        let delim:HieraDelimiter;
        do{
            delim = delimiters[i++];
        }while(i < delimiters.length && delim.isStart != start)
        return delim.delimeter;
    }
}

export class HieraDelimiter{
    constructor (delim:string, start:boolean){
        this.delimeter = delim;
        this.isStart = start;
    }
    delimeter:string;
    isStart:boolean;
}

export class FieldValidationTags{
    // class that wraps the invalid tags for each hiera config field
    constructor(){
        this.paramTags = new Array();
        this.addressTags = new Array();
        this.valueTags= new Array();
    }
    
    paramTags: HieraTag[];
    addressTags: HieraTag[];
    valueTags:HieraTag[];

    public tagValidForParams (tag:string):boolean{
        return !this.containsTag(tag, this.paramTags);
    }

    public tagValidForAddress (tag:string):boolean{
        return !this.containsTag(tag, this.addressTags);
    }

    public tagValidForValue (tag:string):boolean{
        return !this.containsTag(tag, this.valueTags);
    }

    private containsTag (tagName : string, tags:HieraTag[]):boolean{
        return tags.findIndex(x=>x.tag==tagName) >= 0;
    }
    
}

export class HieraTagCollection{
    constructor(){
        this.tags = new Array();
    }
    
    tags: HieraTag[];

    public containsTag (tagName : string):boolean{
        return this.tags.findIndex(x=>x.tag==tagName) >= 0;
    }

    public removeTag (tagName : string) {
        var i = this.tags.findIndex(x=>x.tag==tagName);
        if (i >= 0)
            this.tags.splice(i, 1);
    }

    public addTag(tag:HieraTag){
        this.tags.push(tag);
    }

}


export class HieraRefresh {
    constructor (field:string, value:string){
        this.fieldRefreshed = field;
        this.fieldValue = value;
    }
    fieldRefreshed:string;
    fieldValue:string;
}