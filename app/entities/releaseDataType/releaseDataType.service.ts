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
import { ReleaseDataType } from './releaseDataType';

@Injectable()
export class ReleaseDataTypeService {

    private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('JWTToken')}) });

    constructor(private http: Http, private messageService : MessageService) {}

    /**
     * Get a ReleaseDataType by id.
     */
    getReleaseDataType(id : any) : Observable<ReleaseDataType> {
        return this.http.get('http://localhost:8080/api/releaseDataTypes/' + id, this.options)
            .map(response => <ReleaseDataType> response.json())
            .catch(this.handleError);
    }

    /**
     * Update the passed releaseDataType.
     */
    update(releaseDataType : ReleaseDataType) : Observable<ReleaseDataType> {
        let body = JSON.stringify(releaseDataType);

        return this.http.put('http://localhost:8080/api/releaseDataTypes/', body, this.options)
            .map(response => <ReleaseDataType> response.json())
            .catch(this.handleError);
    }

    /**
     * Load a page (for paginated datatable) of ReleaseDataType using the passed
     * releaseDataType as an example for the search by example facility.
     */
    getPage(releaseDataType : ReleaseDataType, event : LazyLoadEvent) : Observable<PageResponse<ReleaseDataType>> {
        let req = new PageRequestByExample(releaseDataType, event);
        let body = JSON.stringify(req);

        return this.http.post('http://localhost:8080/api/releaseDataTypes/page', body, this.options)
            .map(response => {
                let pr = <PageResponse<ReleaseDataType>> response.json();
                return new PageResponse<ReleaseDataType>(pr.totalPages, pr.totalElements, pr.content);
            })
            .catch(this.handleError);
    }

    /**
     * Performs a search by example on 1 attribute (defined on server side) and returns at most 10 results.
     * Used by ReleaseDataTypeCompleteComponent.
     */
    complete(query : string) : Observable<ReleaseDataType[]> {
        let body = JSON.stringify({'query': query, 'maxResults': 10});
        return this.http.post('http://localhost:8080/api/releaseDataTypes/complete', body, this.options)
            .map(response => <ReleaseDataType[]> response.json())
            .catch(this.handleError);
    }

    /**
     * Delete an ReleaseDataType by id.
     */
    delete(id : any) {
        return this.http.delete('http://localhost:8080/api/releaseDataTypes/' + id, this.options).catch(this.handleError);
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
