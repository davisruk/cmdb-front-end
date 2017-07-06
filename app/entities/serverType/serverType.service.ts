import { Injectable } from '@angular/core';
import { HttpModule, Http, Response, Headers, RequestOptions } from '@angular/http';
import { LazyLoadEvent } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';
import { MessageService } from '../../service/message.service';
import { PageResponse, PageRequestByExample } from '../../support/paging';
import { ServerType } from './serverType';
import { Configuration } from '../../support/configuration';
import { SecurityHelper } from '../../support/security-helper';

@Injectable()
export class ServerTypeService {

    private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': new SecurityHelper().getAuthToken()}) });

    constructor(private http: Http, private messageService : MessageService, private settings:Configuration) {}

    /**
     * Get a ServerType by id.
     */
    getServerType(id : any) : Observable<ServerType> {
        return this.http.get(this.settings.createBackendURLFor('api/serverTypes/' + id), this.options)
            .map(response => <ServerType> response.json())
            .catch(this.handleError);
    }

    getAll() : Observable<ServerType[]> {
        return this.http.get(this.settings.createBackendURLFor('api/serverTypes/'), this.options)
            .map(response => <ServerType> response.json())
            .catch(this.handleError);
    }
    
    /**
     * Update the passed serverType.
     */
    update(serverType : ServerType) : Observable<ServerType> {
        let body = JSON.stringify(serverType);

        return this.http.put(this.settings.createBackendURLFor('api/serverTypes/'), body, this.options)
            .map(response => <ServerType> response.json())
            .catch(this.handleError);
    }

    /**
     * Load a page (for paginated datatable) of ServerType using the passed
     * serverType as an example for the search by example facility.
     */
    getPage(serverType : ServerType, event : LazyLoadEvent) : Observable<PageResponse<ServerType>> {
        let req = new PageRequestByExample(serverType, event);
        let body = JSON.stringify(req);

        return this.http.post(this.settings.createBackendURLFor('api/serverTypes/page'), body, this.options)
            .map(response => {
                let pr = <PageResponse<ServerType>> response.json();
                return new PageResponse<ServerType>(pr.totalPages, pr.totalElements, pr.content);
            })
            .catch(this.handleError);
    }

    /**
     * Performs a search by example on 1 attribute (defined on server side) and returns at most 10 results.
     * Used by ServerTypeCompleteComponent.
     */
    complete(query : string) : Observable<ServerType[]> {
        let body = JSON.stringify({'query': query, 'maxResults': 10});
        return this.http.post(this.settings.createBackendURLFor('api/serverTypes/complete'), body, this.options)
            .map(response => <ServerType[]> response.json())
            .catch(this.handleError);
    }

    /**
     * Delete an ServerType by id.
     */
    delete(id : any) {
        return this.http.delete(this.settings.createBackendURLFor('api/serverTypes/' + id), this.options).catch(this.handleError);
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
