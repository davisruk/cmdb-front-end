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
import { EnvironmentConfig } from './environmentConfig';
import { Configuration } from '../../support/configuration'
@Injectable()
export class EnvironmentConfigService {

    private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('JWTToken')}) });

    constructor(private http: Http, private messageService : MessageService, private settings:Configuration) {}

    /**
     * Get a EnvironmentConfig by id.
     */
    getEnvironmentConfig(id : any) : Observable<EnvironmentConfig> {
        return this.http.get(this.settings.createBackendURLFor('api/environmentConfigs/' + id), this.options)
            .map(response => <EnvironmentConfig> response.json())
            .catch(this.handleError);
    }

    /**
     * Update the passed environmentConfig.
     */
    update(environmentConfig : EnvironmentConfig) : Observable<EnvironmentConfig> {
        let body = JSON.stringify(environmentConfig);

        return this.http.put(this.settings.createBackendURLFor('api/environmentConfigs/'), body, this.options)
            .map(response => <EnvironmentConfig> response.json())
            .catch(this.handleError);
    }

    /**
     * Load a page (for paginated datatable) of EnvironmentConfig using the passed
     * environmentConfig as an example for the search by example facility.
     */
    getPage(environmentConfig : EnvironmentConfig, event : LazyLoadEvent) : Observable<PageResponse<EnvironmentConfig>> {
        let req = new PageRequestByExample(environmentConfig, event);
        let body = JSON.stringify(req);

        return this.http.post(this.settings.createBackendURLFor('api/environmentConfigs/page'), body, this.options)
            .map(response => {
                let pr = <PageResponse<EnvironmentConfig>> response.json();
                return new PageResponse<EnvironmentConfig>(pr.totalPages, pr.totalElements, pr.content);
            })
            .catch(this.handleError);
    }

    /**
     * Performs a search by example on 1 attribute (defined on server side) and returns at most 10 results.
     * Used by EnvironmentConfigCompleteComponent.
     */
    complete(query : string) : Observable<EnvironmentConfig[]> {
        let body = JSON.stringify({'query': query, 'maxResults': 10});
        return this.http.post(this.settings.createBackendURLFor('api/environmentConfigs/complete'), body, this.options)
            .map(response => <EnvironmentConfig[]> response.json())
            .catch(this.handleError);
    }

    /**
     * Delete an EnvironmentConfig by id.
     */
    delete(id : any) {
        return this.http.delete(this.settings.createBackendURLFor('api/environmentConfigs/' + id), this.options).catch(this.handleError);
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
