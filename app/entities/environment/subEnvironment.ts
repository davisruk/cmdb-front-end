import {Release} from "../release/release";
import {Environment} from "../environment/environment";
import {Server} from "../server/server";
export class SubEnvironment {
    id: number;
    release: Release;
    subEnvironmentType: SubEnvironmentType;
    environment: Environment;
    servers: Server[];
}

export class SubEnvironmentType {
    id: number;
    name: string;
}