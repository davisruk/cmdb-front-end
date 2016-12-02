import {Release} from '../release/release';
import {Server} from '../server/server';
import {SubEnvironment} from './subEnvironment';
export class Environment {
    // Raw attributes
    id : number;
    name : string;
    type : EnvironmentType;
    // x-to-one
    release : Release;
    servers : Server[];

    subEnvironments : SubEnvironment[];
}

export class EnvironmentType {
    id : number;
    name : string;
}