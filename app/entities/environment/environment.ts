import {Release} from '../release/release';
import {Server} from '../server/server';
import {SubEnvironment} from './subEnvironment';
import {BaseEntity} from '../../support/base-entity';

export class Environment extends BaseEntity {
    // Raw attributes
    name : string;
    type : EnvironmentType;
    subEnvironments : SubEnvironment[];

    constructor(){
        super();
    }
}

export class EnvironmentType extends BaseEntity{
    name : string;
    
    constructor(){
        super();
    }

}