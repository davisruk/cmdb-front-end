import {SubEnvironment} from '../environment/subEnvironment';
import {BaseEntity} from '../../support/base-entity';

export class SubEnvironmentConfig extends BaseEntity {
    // Raw attributes
    id : number;
    parameter : string;
    value : string;
    hieraAddress : string;
    notes: string;
    sensitive : boolean;
    
    // x-to-one
    subEnvironment : SubEnvironment;

        constructor(){
        super();
        this.parameter = "";
        this.value = "";
        this.hieraAddress = "";
        this.notes = "";
        this.sensitive = false;
    }

}
