import { JwtHelper } from 'angular2-jwt';
export class SecurityHelper{
    public userHasWriteSensitive():boolean{
        return this.userHasRoleOrPrivelege('WRITE_SENSITIVE');
    }

    public userIsAdmin():boolean{
        return this.userHasRoleOrPrivelege('ROLE_ADMIN');
    }

    private userHasRoleOrPrivelege(checkItem:string):boolean{
        var token = localStorage.getItem('JWTToken');
        let jwtHelper: JwtHelper = new JwtHelper();
        let retVal:boolean = false;
        var decodedToken = jwtHelper.decodeToken(token);
        decodedToken.userdeets.authorities.forEach((element:any) => {
            let authority:String = element.authority;
            if (authority == checkItem)
                retVal=true;
        });
        return retVal;
    }
    
}