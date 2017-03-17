export class BaseEntity {
    id : number;
    version : number;

    constructor(){
        this.version = 0;
    }
}