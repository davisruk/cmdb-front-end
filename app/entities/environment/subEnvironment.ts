import {Release} from "../release/release";
import {Environment} from "../environment/environment";
import {Server} from "../server/server";
import {BaseEntity} from '../../support/base-entity';

export class SubEnvironment extends BaseEntity{
    release: Release;
    subEnvironmentType: SubEnvironmentType;
    environment: Environment;
    servers: Server[];
    constructor(){
        super();
    }
}

export class SubEnvironmentType extends BaseEntity {
    name: string;
    constructor(){
        super();
    }    
}