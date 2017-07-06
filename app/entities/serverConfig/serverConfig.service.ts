import { Injectable } from '@angular/core';
import { HttpModule, Http, Response, Headers, RequestOptions } from '@angular/http';
import { LazyLoadEvent } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';
import { MessageService } from '../../service/message.service';
import { PageResponse, PageRequestByExample } from '../../support/paging';
import { ServerConfig } from './serverConfig';
import { Configuration } from '../../support/configuration';
import { CopyContainer } from '../../support/copy-container';
import { SecurityHelper } from '../../support/security-helper';

@Injectable()
export class ServerConfigService {

    private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': new SecurityHelper().getAuthToken()}) });

    constructor(private http: Http, private messageService : MessageService, private settings : Configuration) {}

    /**
     * Get a ServerConfig by id.
     */
    getServerConfig(id : any) : Observable<ServerConfig> {
        return this.http.get(this.settings.createBackendURLFor('api/serverConfigs/' + id), this.options)
            .map(response => <ServerConfig> response.json())
            .catch(this.handleError);
    }

    /**
     * Update the passed serverConfig.
     */
    update(serverConfig : ServerConfig) : Observable<ServerConfig> {
        let body = JSON.stringify(serverConfig);

        return this.http.put(this.settings.createBackendURLFor('api/serverConfigs/'), body, this.options)
            .map(response => <ServerConfig> response.json())
            .catch(this.handleError);
    }

    copyConfigForServer(cc:CopyContainer){
        let body = JSON.stringify(cc);
        let URL = this.settings.createBackendURLFor('api/serverConfigs/copy');
        return this.http.post(URL, body, this.options).catch(this.handleError);
    }
    

    /**
     * Load a page (for paginated datatable) of ServerConfig using the passed
     * serverConfig as an example for the search by example facility.
     */
    getPage(serverConfig : ServerConfig, event : LazyLoadEvent) : Observable<PageResponse<ServerConfig>> {
        let req = new PageRequestByExample(serverConfig, event);
        let body = JSON.stringify(req);

        return this.http.post(this.settings.createBackendURLFor('api/serverConfigs/page'), body, this.options)
            .map(response => {
                let pr = <PageResponse<ServerConfig>> response.json();
                return new PageResponse<ServerConfig>(pr.totalPages, pr.totalElements, pr.content);
            })
            .catch(this.handleError);
    }

    /**
     * Performs a search by example on 1 attribute (defined on server side) and returns at most 10 results.
     * Used by ServerConfigCompleteComponent.
     */
    complete(query : string) : Observable<ServerConfig[]> {
        let body = JSON.stringify({'query': query, 'maxResults': 10});
        return this.http.post(this.settings.createBackendURLFor('api/serverConfigs/complete'), body, this.options)
            .map(response => <ServerConfig[]> response.json())
            .catch(this.handleError);
    }

    /**
     * Delete an ServerConfig by id.
     */
    delete(id : any) {
        return this.http.delete(this.settings.createBackendURLFor('api/serverConfigs/' + id), this.options).catch(this.handleError);
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
