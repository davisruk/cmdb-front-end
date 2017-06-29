import { Injectable } from '@angular/core';
import { HttpModule, Http, Response, Headers, RequestOptions } from '@angular/http';
import { LazyLoadEvent } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';
import { MessageService } from '../../service/message.service';
import { PageResponse, PageRequestByExample } from '../../support/paging';
import { ReleaseConfig } from './releaseConfig';
import { Configuration } from '../../support/configuration';
import { CopyContainer } from '../../support/copy-container';

@Injectable()
export class ReleaseConfigService {

    private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('JWTToken')}) });

    constructor(private http: Http, private messageService : MessageService, private settings : Configuration) {}

    /**
     * Get a ReleaseConfig by id.
     */
    getReleaseConfig(id : any) : Observable<ReleaseConfig> {
        return this.http.get(this.settings.createBackendURLFor('api/releaseConfigs/' + id), this.options)
            .map(response => <ReleaseConfig> response.json())
            .catch(this.handleError);
    }

    /**
     * Update the passed releaseConfig.
     */
    update(releaseConfig : ReleaseConfig) : Observable<ReleaseConfig> {
        let body = JSON.stringify(releaseConfig);

        return this.http.put(this.settings.createBackendURLFor('api/releaseConfigs/'), body, this.options)
            .map(response => <ReleaseConfig> response.json())
            .catch(this.handleError);
    }

    copyConfigForRelease(cc:CopyContainer){
        let body = JSON.stringify(cc);
        let URL = this.settings.createBackendURLFor('api/releaseConfigs/copy');
        return this.http.post(URL, body, this.options).catch(this.handleError);
    }

    /**
     * Load a page (for paginated datatable) of ReleaseConfig using the passed
     * releaseConfig as an example for the search by example facility.
     */
    getPage(releaseConfig : ReleaseConfig, event : LazyLoadEvent) : Observable<PageResponse<ReleaseConfig>> {
        let req = new PageRequestByExample(releaseConfig, event);
        let body = JSON.stringify(req);

        return this.http.post(this.settings.createBackendURLFor('api/releaseConfigs/page'), body, this.options)
            .map(response => {
                let pr = <PageResponse<ReleaseConfig>> response.json();
                return new PageResponse<ReleaseConfig>(pr.totalPages, pr.totalElements, pr.content);
            })
            .catch(this.handleError);
    }

    /**
     * Performs a search by example on 1 attribute (defined on server side) and returns at most 10 results.
     * Used by ReleaseConfigCompleteComponent.
     */
    complete(query : string) : Observable<ReleaseConfig[]> {
        let body = JSON.stringify({'query': query, 'maxResults': 10});
        return this.http.post(this.settings.createBackendURLFor('api/releaseConfigs/complete'), body, this.options)
            .map(response => <ReleaseConfig[]> response.json())
            .catch(this.handleError);
    }

    /**
     * Delete an ReleaseConfig by id.
     */
    delete(id : any) {
        return this.http.delete(this.settings.createBackendURLFor('api/releaseConfigs/' + id), this.options).catch(this.handleError);
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
