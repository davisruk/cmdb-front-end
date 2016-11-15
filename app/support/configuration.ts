import { HttpModule, Http } from '@angular/http';
import { Injectable } from '@angular/core'

@Injectable ()
export class Configuration {
    private frontEndHostName: string;
    private frontEndHostPort: string;
    private backEndHostName: string;
    private backEndHostPort: string;
    
    constructor(private http: Http){
        this.readSettingsFromFile();
    }
    getFrontEndHostName() :string{
        return this.frontEndHostName;
    }

    getFrontEndHostPort() :string{
        return this.frontEndHostPort;
    }

    getFrontEndHostAndPort() :string{
        return this.frontEndHostName + ":" + this.frontEndHostPort;
    }

    getBackEndHostName() :string{
        return this.backEndHostName;
    }

    getBackEndHostPort() :string{
        return this.backEndHostPort;
    }

    getBackEndHostAndPort() :string{
        return this.backEndHostName + ":" + this.backEndHostPort;
    }

    createBackendURLFor(apiEndpoint:string) : string{
        return `http://${this.backEndHostName}:${this.backEndHostPort}/${apiEndpoint}`;
    }
    createFrontendURLFor(apiEndpoint:string) : string{
        return `http://${this.frontEndHostName}:${this.frontEndHostPort}/${apiEndpoint}`;
    }

    readSettingsFromFile (){
        this.http.get('/app/settings.json')
                  .map(res => res.json())
                  .subscribe(
                     (data) => {
                       this.frontEndHostName=data.frontEndHostName;
                       this.frontEndHostPort=data.frontEndHostPort;
                       this.backEndHostName=data.backEndHostName;
                       this.backEndHostPort=data.backEndHostPort;
                       console.log(this.frontEndHostName);
                       console.log(this.frontEndHostPort);
                       console.log(this.getFrontEndHostAndPort());
                       console.log(this.backEndHostName);
                       console.log(this.backEndHostPort);
                       console.log(this.getBackEndHostAndPort());
                     },
                     err=>console.log(err),
                     ()=>console.log('done')
                   );
    }
}