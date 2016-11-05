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
import { Release } from './release';
import { HieraValues } from '../hiera/hieraValues';

@Injectable()
export class ReleaseService {

    private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });

    constructor(private http: Http, private messageService : MessageService) {}

    /**
     * Get a Release by id.
     */
    getRelease(id : any) : Observable<Release> {
        return this.http.get('http://localhost:8080/api/releases/' + id)
            .map(response => <Release> response.json())
            .catch(this.handleError);
    }

    getHieraValues(name : String) : Observable<HieraValues[]> {
        return this.http.get('http://localhost:8080/api/environments/configs/' + name)
            .map(response => <HieraValues[]> response.json())
            .catch(this.handleError);
    }


    /**
     * Update the passed release.
     */
    update(release : Release) : Observable<Release> {
        let body = JSON.stringify(release);

        return this.http.put('http://localhost:8080/api/releases/', body, this.options)
            .map(response => <Release> response.json())
            .catch(this.handleError);
    }

    /**
     * Load a page (for paginated datatable) of Release using the passed
     * release as an example for the search by example facility.
     */
    getPage(release : Release, event : LazyLoadEvent) : Observable<PageResponse<Release>> {
        let req = new PageRequestByExample(release, event);
        let body = JSON.stringify(req);

        return this.http.post('http://localhost:8080/api/releases/page', body, this.options)
            .map(response => {
                let pr = <PageResponse<Release>> response.json();
                return new PageResponse<Release>(pr.totalPages, pr.totalElements, pr.content);
            })
            .catch(this.handleError);
    }

    /**
     * Performs a search by example on 1 attribute (defined on server side) and returns at most 10 results.
     * Used by ReleaseCompleteComponent.
     */
    complete(query : string) : Observable<Release[]> {
        let body = JSON.stringify({'query': query, 'maxResults': 10});
        return this.http.post('http://localhost:8080/api/releases/complete', body, this.options)
            .map(response => <Release[]> response.json())
            .catch(this.handleError);
    }

    /**
     * Delete an Release by id.
     */
    delete(id : any) {
        return this.http.delete('http://localhost:8080/api/releases/' + id).catch(this.handleError);
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
