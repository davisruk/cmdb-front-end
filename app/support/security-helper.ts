import { JwtHelper } from 'angular2-jwt';
export class SecurityHelper{
    public userHasWriteSensitive():boolean{
        var token = localStorage.getItem('JWTToken');
        let jwtHelper: JwtHelper = new JwtHelper();
        let retVal:boolean = false;
        var decodedToken = jwtHelper.decodeToken(token);
        decodedToken.userdeets.authorities.forEach((element:any) => {
            let authority:String = element.authority;
            if (authority == 'WRITE_SENSITIVE')
                retVal=true;
        });
        return retVal;
    }
}