import {Release} from "../release/release";
import {Environment} from "../environment/environment";
export class SubEnvironment {
    id: number;
    release: Release;
    subEnvironmentType: SubEnvironmentType;
    environment: Environment;
}

export class SubEnvironmentType {
    id: number;
    name: string;
}