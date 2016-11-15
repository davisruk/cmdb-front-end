//
// Source code generated by Celerio, a Jaxio product.
// Documentation: http://www.jaxio.com/documentation/celerio/
// Follow us on twitter: @jaxiosoft
// Need commercial support ? Contact us: info@jaxio.com
// Template pack-angular:src/main/webapp/app/entities/entity.service.ts.e.vm
//
import { Injectable } from '@angular/core';
import { HttpModule, Http, Response, Headers, RequestOptions } from '@angular/http';
import { LazyLoadEvent } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';
import { MessageService } from '../../service/message.service';
import { PageResponse, PageRequestByExample } from '../../support/paging';
import { PackageType } from './packageType';
import { Configuration } from '../../support/configuration';

@Injectable()
export class PackageTypeService {

private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('JWTToken')}) });

    constructor(private http: Http, private messageService : MessageService, private settings : Configuration) {}

    /**
     * Get a PackageType by id.
     */
    getPackageType(id : any) : Observable<PackageType> {
        return this.http.get(this.settings.createBackendURLFor('api/packageTypes/' + id), this.options)
            .map(response => <PackageType> response.json())
            .catch(this.handleError);
    }

    /**
     * Update the passed packageType.
     */
    update(packageType : PackageType) : Observable<PackageType> {
        let body = JSON.stringify(packageType);

        return this.http.put(this.settings.createBackendURLFor('api/packageTypes/'), body, this.options)
            .map(response => <PackageType> response.json())
            .catch(this.handleError);
    }

    /**
     * Load a page (for paginated datatable) of PackageType using the passed
     * packageType as an example for the search by example facility.
     */
    getPage(packageType : PackageType, event : LazyLoadEvent) : Observable<PageResponse<PackageType>> {
        let req = new PageRequestByExample(packageType, event);
        let body = JSON.stringify(req);

        return this.http.post(this.settings.createBackendURLFor('api/packageTypes/page'), body, this.options)
            .map(response => {
                let pr = <PageResponse<PackageType>> response.json();
                return new PageResponse<PackageType>(pr.totalPages, pr.totalElements, pr.content);
            })
            .catch(this.handleError);
    }

    /**
     * Performs a search by example on 1 attribute (defined on server side) and returns at most 10 results.
     * Used by PackageTypeCompleteComponent.
     */
    complete(query : string) : Observable<PackageType[]> {
        let body = JSON.stringify({'query': query, 'maxResults': 10});
        return this.http.post('api/packageTypes/complete', body, this.options)
            .map(response => <PackageType[]> response.json())
            .catch(this.handleError);
    }

    /**
     * Delete an PackageType by id.
     */
    delete(id : any) {
        return this.http.delete(this.settings.createBackendURLFor('api/packageTypes/' + id), this.options).catch(this.handleError);
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
