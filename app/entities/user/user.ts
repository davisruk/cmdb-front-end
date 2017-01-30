import {Role} from '../role/role';

export class User {
    id: number;
    username: string;
    email:string;
    enabled:boolean;
    password:string;
    roles:Role[];
}