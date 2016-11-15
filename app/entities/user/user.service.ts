import { Injectable } from '@angular/core';
import { HttpModule, Http, Response, Headers, RequestOptions } from '@angular/http';
import { LazyLoadEvent } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';
import { MessageService } from '../../service/message.service';
import { PageResponse, PageRequestByExample } from '../../support/paging';
import { User } from './user';
import { Configuration } from '../../support/configuration';

@Injectable()
export class UserService {

    private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('JWTToken')}) });

    constructor(private http: Http, private messageService : MessageService, private settings : Configuration) {}

    /**
     * Get a ServerType by id.
     */
    getUser(id : any) : Observable<User> {
        return this.http.get(this.settings.createBackendURLFor('api/users/' + id), this.options)
            .map(response => <User> response.json())
            .catch(this.handleError);
    }

    /**
     * Update the passed serverType.
     */
    update(user : User) : Observable<User> {
        let body = JSON.stringify(user);

        return this.http.put(this.settings.createBackendURLFor('api/users/'), body, this.options)
            .map(response => <User> response.json())
            .catch(this.handleError);
    }

    /**
     * Load a page (for paginated datatable) of ServerType using the passed
     * serverType as an example for the search by example facility.
     */
    getPage(user : User, event : LazyLoadEvent) : Observable<PageResponse<User>> {
        let req = new PageRequestByExample(user, event);
        let body = JSON.stringify(req);

        return this.http.post(this.settings.createBackendURLFor('api/users/page'), body, this.options)
            .map(response => {
                let pr = <PageResponse<User>> response.json();
                return new PageResponse<User>(pr.totalPages, pr.totalElements, pr.content);
            })
            .catch(this.handleError);
    }

    /**
     * Performs a search by example on 1 attribute (defined on server side) and returns at most 10 results.
     * Used by ServerTypeCompleteComponent.
     */
    complete(query : string) : Observable<User[]> {
        let body = JSON.stringify({'query': query, 'maxResults': 10});
        return this.http.post(this.settings.createBackendURLFor('api/users/complete'), body, this.options)
            .map(response => <User[]> response.json())
            .catch(this.handleError);
    }

    /**
     * Delete an ServerType by id.
     */
    delete(id : any) {
        return this.http.delete(this.settings.createBackendURLFor('api/users/' + id), this.options).catch(this.handleError);
    }

    // sample method from angular doc
    private handleError (error: any) {
        // TODO: seems we cannot use messageService from here...
        let errMsg = (error.message) ? error.message :
        error.status ? `Status: ${error.status} - Text: ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}
