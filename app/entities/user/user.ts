import {Role} from '../role/role';

export class User {
    id: number;
    userName: string;
    email:string;
    enabled:boolean;
    password:string;
    roles:Role[];
}