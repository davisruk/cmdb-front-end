import { Injectable } from '@angular/core';
import { HttpModule, Http, Response, Headers, RequestOptions } from '@angular/http';
import { LazyLoadEvent } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';
import { MessageService } from '../../service/message.service';
import { PageResponse, PageRequestByExample } from '../../support/paging';
import { ReleaseData } from './releaseData';
import { Configuration } from '../../support/configuration';
import { SecurityHelper } from '../../support/security-helper';


@Injectable()
export class ReleaseDataService {

    private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': new SecurityHelper().getAuthToken()}) });

    constructor(private http: Http, private messageService : MessageService, private settings : Configuration) {}

    /**
     * Get a ReleaseData by id.
     */
    getReleaseData(id : any) : Observable<ReleaseData> {
        return this.http.get(this.settings.createBackendURLFor('api/releaseDatas/' + id), this.options)
            .map(response => <ReleaseData> response.json())
            .catch(this.handleError);
    }

    /**
     * Update the passed releaseData.
     */
    update(releaseData : ReleaseData) : Observable<ReleaseData> {
        let body = JSON.stringify(releaseData);

        return this.http.put(this.settings.createBackendURLFor('api/releaseDatas/'), body, this.options)
            .map(response => <ReleaseData> response.json())
            .catch(this.handleError);
    }

    /**
     * Load a page (for paginated datatable) of ReleaseData using the passed
     * releaseData as an example for the search by example facility.
     */
    getPage(releaseData : ReleaseData, event : LazyLoadEvent) : Observable<PageResponse<ReleaseData>> {
        let req = new PageRequestByExample(releaseData, event);
        let body = JSON.stringify(req);

        return this.http.post(this.settings.createBackendURLFor('api/releaseDatas/page'), body, this.options)
            .map(response => {
                let pr = <PageResponse<ReleaseData>> response.json();
                return new PageResponse<ReleaseData>(pr.totalPages, pr.totalElements, pr.content);
            })
            .catch(this.handleError);
    }

    /**
     * Performs a search by example on 1 attribute (defined on server side) and returns at most 10 results.
     * Used by ReleaseDataCompleteComponent.
     */
    complete(query : string) : Observable<ReleaseData[]> {
        let body = JSON.stringify({'query': query, 'maxResults': 10});
        return this.http.post(this.settings.createBackendURLFor('api/releaseDatas/complete'), body, this.options)
            .map(response => <ReleaseData[]> response.json())
            .catch(this.handleError);
    }

    /**
     * Delete an ReleaseData by id.
     */
    delete(id : any) {
        return this.http.delete(this.settings.createBackendURLFor('api/releaseDatas/' + id), this.options).catch(this.handleError);
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
