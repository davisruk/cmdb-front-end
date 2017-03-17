import { Injectable } from '@angular/core';
import { HttpModule, Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MessageService } from '../../service/message.service';
import { SubEnvironment, SubEnvironmentType } from './subEnvironment';
import { RefreshService } from '../../support/refresh.service';
import { Configuration } from '../../support/configuration';

@Injectable()
export class SubEnvironmentService implements RefreshService {

    private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('JWTToken')}) });
    
    constructor(private http: Http, private messageService : MessageService, private settings : Configuration) {}

    refreshData(id : any) : Observable<any> {
        return this.getSubEnvironment(id);
    }

    getSubEnvironment(id : any) : Observable<SubEnvironment> {
        return this.http.get(this.settings.createBackendURLFor('api/subenvironments/' + id), this.options)
            .map(response => <SubEnvironment> response.json())
            .catch(this.handleError);
    }

    private handleError (error: any) {
        return Observable.throw(error.json().message);
    }
    
}