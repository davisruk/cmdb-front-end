
import {SolutionComponent} from '../solutionComponent/solutionComponent';

export class ComponentConfig {
    // Raw attributes
    id : number;
    parameter : string;
    value : string;
    hieraAddress : string;
    notes: string;
    sensitive : boolean;
    version : number;

    // x-to-one
    my_component : SolutionComponent;
    
    constructor(){
        this.parameter = "";
        this.value = "";
        this.hieraAddress = "";
        this.notes = "";
        this.sensitive = false;
        this.version = 0;
    }

}
