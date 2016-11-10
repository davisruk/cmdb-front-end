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
import { SolutionComponent } from './solutionComponent';
import { HieraValues } from '../hiera/hieravalues';

@Injectable()
export class SolutionComponentService {

    private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('JWTToken')}) });

    constructor(private http: Http, private messageService : MessageService) {}

    /**
     * Get a SolutionComponent by id.
     */
    getSolutionComponent(id : any) : Observable<SolutionComponent> {
        return this.http.get('http://localhost:8080/api/solutionComponents/' + id, this.options)
            .map(response => <SolutionComponent> response.json())
            .catch(this.handleError);
    }

    getHieraValues(id : number) : Observable<HieraValues[]> {
        return this.http.get('http://localhost:8080/api/solutionComponents/configs/' + id, this.options)
            .map(response => <HieraValues[]> response.json())
            .catch(this.handleError);
    }

    /**
     * Update the passed solutionComponent.
     */
    update(solutionComponent : SolutionComponent) : Observable<SolutionComponent> {
        let body = JSON.stringify(solutionComponent);

        return this.http.put('http://localhost:8080/api/solutionComponents/', body, this.options)
            .map(response => <SolutionComponent> response.json())
            .catch(this.handleError);
    }

    /**
     * Load a page (for paginated datatable) of SolutionComponent using the passed
     * solutionComponent as an example for the search by example facility.
     */
    getPage(solutionComponent : SolutionComponent, event : LazyLoadEvent) : Observable<PageResponse<SolutionComponent>> {
        let req = new PageRequestByExample(solutionComponent, event);
        let body = JSON.stringify(req);

        return this.http.post('http://localhost:8080/api/solutionComponents/page', body, this.options)
            .map(response => {
                let pr = <PageResponse<SolutionComponent>> response.json();
                return new PageResponse<SolutionComponent>(pr.totalPages, pr.totalElements, pr.content);
            })
            .catch(this.handleError);
    }

    /**
     * Performs a search by example on 1 attribute (defined on server side) and returns at most 10 results.
     * Used by SolutionComponentCompleteComponent.
     */
    complete(query : string) : Observable<SolutionComponent[]> {
        let body = JSON.stringify({'query': query, 'maxResults': 10});
        return this.http.post('http://localhost:8080/api/solutionComponents/complete', body, this.options)
            .map(response => <SolutionComponent[]> response.json())
            .catch(this.handleError);
    }

    /**
     * Delete an SolutionComponent by id.
     */
    delete(id : any) {
        return this.http.delete('http://localhost:8080/api/solutionComponents/' + id, this.options).catch(this.handleError);
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
