export class HieraTag {
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

export class HieraTagUIConfig{
    includeReleaseTag:boolean;
    includeParamTag:boolean;
    includeEnvTag:boolean;
    includeSubEnvTag:boolean;
    includeServerTag:boolean;
    includeServerTypeTag:boolean;

    constructor (hasReleaseTag:boolean, hasParamTag:boolean, hasEnvTag:boolean,
                hasSubEnvTag:boolean, hasServerTag:boolean, hasServerTypeTag:boolean){
        this.includeEnvTag = hasEnvTag;
        this.includeParamTag = hasParamTag;
        this.includeReleaseTag = hasReleaseTag;
        this.includeServerTag = hasServerTag;
        this.includeServerTypeTag = hasServerTypeTag;
        this.includeSubEnvTag = hasSubEnvTag;
    }
}