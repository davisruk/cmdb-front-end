import {SolutionComponent} from '../solutionComponent/solutionComponent';
import {BaseEntity} from '../../support/base-entity';

export class ComponentConfig extends BaseEntity{
    parameter : string;
    value : string;
    hieraAddress : string;
    notes: string;
    sensitive : boolean;

    // x-to-one
    my_component : SolutionComponent;
    
    constructor() {
        super();
        this.parameter = "";
        this.value = "";
        this.hieraAddress = "";
        this.notes = "";
        this.sensitive = false;
    }

}
