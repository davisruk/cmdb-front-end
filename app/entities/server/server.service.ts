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
import { Server } from './server';
import { HieraValues } from '../hiera/hieraValues';
import { Configuration } from '../../support/configuration';

@Injectable()
export class ServerService {

    private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('JWTToken')}) });

    constructor(private http: Http, private messageService : MessageService, private settings:Configuration) {}

    /**
     * Get a Server by id.
     */
    getServer(id : any) : Observable<Server> {
        return this.http.get(this.settings.createBackendURLFor('api/servers/' + id), this.options)
            .map(response => <Server> response.json())
            .catch(this.handleError);
    }

    getHieraValues(name : String) : Observable<HieraValues[]> {
        return this.http.get(this.settings.createBackendURLFor('api/servers/configs/' + name), this.options)
            .map(response => <HieraValues[]> response.json())
            .catch(this.handleError);
    }

    /**
     * Update the passed server.
     */
    update(server : Server) : Observable<Server> {
        let body = JSON.stringify(server);

        return this.http.put(this.settings.createBackendURLFor('api/servers/'), body, this.options)
            .map(response => <Server> response.json())
            .catch(this.handleError);
    }

    /**
     * Load a page (for paginated datatable) of Server using the passed
     * server as an example for the search by example facility.
     */
    getPage(server : Server, event : LazyLoadEvent) : Observable<PageResponse<Server>> {
        let req = new PageRequestByExample(server, event);
        let body = JSON.stringify(req);

        return this.http.post(this.settings.createBackendURLFor('api/servers/page'), body, this.options)
            .map(response => {
                let pr = <PageResponse<Server>> response.json();
                return new PageResponse<Server>(pr.totalPages, pr.totalElements, pr.content);
            })
            .catch(this.handleError);
    }

    /**
     * Performs a search by example on 1 attribute (defined on server side) and returns at most 10 results.
     * Used by ServerCompleteComponent.
     */
    complete(query : string) : Observable<Server[]> {
        let body = JSON.stringify({'query': query, 'maxResults': 10});
        return this.http.post(this.settings.createBackendURLFor('api/servers/complete'), body, this.options)
            .map(response => <Server[]> response.json())
            .catch(this.handleError);
    }

    /**
     * Delete an Server by id.
     */
    delete(id : any) {
        return this.http.delete(this.settings.createBackendURLFor('api/servers/' + id), this.options).catch(this.handleError);
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
