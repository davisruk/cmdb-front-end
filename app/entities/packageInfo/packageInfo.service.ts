import { Injectable } from '@angular/core';
import { HttpModule, Http, Response, Headers, RequestOptions } from '@angular/http';
import { LazyLoadEvent } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';
import { MessageService } from '../../service/message.service';
import { PageResponse, PageRequestByExample } from '../../support/paging';
import { PackageInfo } from './packageInfo';
import { Configuration } from '../../support/configuration';
import { SecurityHelper } from '../../support/security-helper';

@Injectable()
export class PackageInfoService {

    private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': new SecurityHelper().getAuthToken()}) });

    constructor(private http: Http, private messageService : MessageService, private settings : Configuration) {}

    /**
     * Get a PackageInfo by id.
     */
    getPackageInfo(id : any) : Observable<PackageInfo> {
        return this.http.get(this.settings.createBackendURLFor('api/packageInfos/' + id), this.options)
            .map(response => <PackageInfo> response.json())
            .catch(this.handleError);
    }

    /**
     * Update the passed packageInfo.
     */
    update(packageInfo : PackageInfo) : Observable<PackageInfo> {
        let body = JSON.stringify(packageInfo);

        return this.http.put(this.settings.createBackendURLFor('api/packageInfos/'), body, this.options)
            .map(response => <PackageInfo> response.json())
            .catch(this.handleError);
    }

    /**
     * Load a page (for paginated datatable) of PackageInfo using the passed
     * packageInfo as an example for the search by example facility.
     */
    getPage(packageInfo : PackageInfo, event : LazyLoadEvent) : Observable<PageResponse<PackageInfo>> {
        let req = new PageRequestByExample(packageInfo, event);
        let body = JSON.stringify(req);

        return this.http.post(this.settings.createBackendURLFor('api/packageInfos/page'), body, this.options)
            .map(response => {
                let pr = <PageResponse<PackageInfo>> response.json();
                return new PageResponse<PackageInfo>(pr.totalPages, pr.totalElements, pr.content);
            })
            .catch(this.handleError);
    }

    /**
     * Performs a search by example on 1 attribute (defined on server side) and returns at most 10 results.
     * Used by PackageInfoCompleteComponent.
     */
    complete(query : string) : Observable<PackageInfo[]> {
        let body = JSON.stringify({'query': query, 'maxResults': 10});
        return this.http.post(this.settings.createBackendURLFor('api/packageInfos/complete'), body, this.options)
            .map(response => <PackageInfo[]> response.json())
            .catch(this.handleError);
    }

    /**
     * Delete an PackageInfo by id.
     */
    delete(id : any) {
        return this.http.delete(this.settings.createBackendURLFor('api/packageInfos/' + id), this.options).catch(this.handleError);
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
