import { Injectable } from '@angular/core';
import { HttpModule, Http, Response, Headers, RequestOptions } from '@angular/http';
import { LazyLoadEvent } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';
import { MessageService } from '../../service/message.service';
import { PageResponse, PageRequestByExample } from '../../support/paging';
import { Globalconfig } from './globalconfig';
import { Configuration } from '../../support/configuration';
import { SecurityHelper } from '../../support/security-helper';

@Injectable()
export class GlobalconfigService {

    private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': new SecurityHelper().getAuthToken()}) });

    constructor(private http: Http, private messageService : MessageService, private settings:Configuration) {}

    /**
     * Get a Globalconfig by id.
     */
    getGlobalconfig(id : any) : Observable<Globalconfig> {
        return this.http.get(this.settings.createBackendURLFor('api/globalconfigs/' + id), this.options)
            .map(response => <Globalconfig> response.json())
            .catch(this.handleError);
    }

    /**
     * Update the passed globalconfig.
     */
    update(globalconfig : Globalconfig) : Observable<Globalconfig> {
        let body = JSON.stringify(globalconfig);

        return this.http.put(this.settings.createBackendURLFor('api/globalconfigs/'), body, this.options)
            .map(response => <Globalconfig> response.json())
            .catch(this.handleError);
    }

    /**
     * Load a page (for paginated datatable) of Globalconfig using the passed
     * globalconfig as an example for the search by example facility.
     */
    getPage(globalconfig : Globalconfig, event : LazyLoadEvent) : Observable<PageResponse<Globalconfig>> {
        let req = new PageRequestByExample(globalconfig, event);
        let body = JSON.stringify(req);

        return this.http.post(this.settings.createBackendURLFor('api/globalconfigs/page'), body, this.options)
            .map(response => {
                let pr = <PageResponse<Globalconfig>> response.json();
                return new PageResponse<Globalconfig>(pr.totalPages, pr.totalElements, pr.content);
            })
            .catch(this.handleError);
    }

    /**
     * Performs a search by example on 1 attribute (defined on server side) and returns at most 10 results.
     * Used by GlobalconfigCompleteComponent.
     */
    complete(query : string) : Observable<Globalconfig[]> {
        let body = JSON.stringify({'query': query, 'maxResults': 10});
        return this.http.post(this.settings.createBackendURLFor('api/globalconfigs/complete'), body, this.options)
            .map(response => <Globalconfig[]> response.json())
            .catch(this.handleError);
    }

    /**
     * Delete an Globalconfig by id.
     */
    delete(id : any) {
        return this.http.delete(this.settings.createBackendURLFor('api/globalconfigs/' + id), this.options).catch(this.handleError);
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
