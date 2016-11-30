import {Release} from "../release/release";
import {Environment} from "../environment/environment";
export class SubEnvironment {
    id: number;
    release: Release;
    environment: Environment;
}