export class Release {
    // Raw attributes
    id? : number;
    name? : string;

    constructor()
    constructor(name:string)
    constructor(name?:string){
        this.name = name;
    }
}
