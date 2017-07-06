import { Injectable } from '@angular/core';
import { HttpModule, Http, Response, Headers, RequestOptions } from '@angular/http';
import { LazyLoadEvent } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';
import { MessageService } from '../../service/message.service';
import { PageResponse, PageRequestByExample } from '../../support/paging';
import { ComponentConfig } from './componentConfig';
import { Configuration } from '../../support/configuration';
import { RefreshService } from '../../support/refresh.service';
import { SecurityHelper } from '../../support/security-helper';

@Injectable()
export class ComponentConfigService implements RefreshService{

    private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': new SecurityHelper().getAuthToken()})});

    constructor(private http: Http, private messageService : MessageService, private settings : Configuration) {}

    /**
     * Get a ComponentConfig by id.
     */

    refreshData(id : any) : Observable<any> {
        return this.getComponentConfig(id);
    }

    getComponentConfig(id : any) : Observable<ComponentConfig> {
        return this.http.get(this.settings.createBackendURLFor('api/componentConfigs/' + id), this.options)
            .map(response => <ComponentConfig> response.json())
            .catch(this.handleError);
    }

    /**
     * Update the passed componentConfig.
     */
    update(componentConfig : ComponentConfig) : Observable<ComponentConfig> {
        let body = JSON.stringify(componentConfig);
        
        return this.http.put(this.settings.createBackendURLFor('api/componentConfigs/'), body, this.options)
            .map(response => <ComponentConfig> response.json())
            .catch(this.handleError);
    }

    /**
     * Load a page (for paginated datatable) of ComponentConfig using the passed
     * componentConfig as an example for the search by example facility.
     */
    getPage(componentConfig : ComponentConfig, event : LazyLoadEvent) : Observable<PageResponse<ComponentConfig>> {
        let req = new PageRequestByExample(componentConfig, event);
        let body = JSON.stringify(req);

        return this.http.post(this.settings.createBackendURLFor('api/componentConfigs/page'), body, this.options)
            .map(response => {
                let pr = <PageResponse<ComponentConfig>> response.json();
                return new PageResponse<ComponentConfig>(pr.totalPages, pr.totalElements, pr.content);
            })
            .catch(this.handleError);
    }

    /**
     * Performs a search by example on 1 attribute (defined on server side) and returns at most 10 results.
     * Used by ComponentConfigCompleteComponent.
     */
    complete(query : string) : Observable<ComponentConfig[]> {
        let body = JSON.stringify({'query': query, 'maxResults': 10});

        return this.http.post(this.settings.createBackendURLFor('api/componentConfigs/complete'), body, this.options)
            .map(response => <ComponentConfig[]> response.json())
            .catch(this.handleError);
    }

    /**
     * Delete an ComponentConfig by id.
     */
    delete(id : any) {
        return this.http.delete(this.settings.createBackendURLFor('api/componentConfigs/' + id), this.options).catch(this.handleError);
    }

    // sample method from angular doc
    private handleError (error: any) {
 /*
        let errMsg:string;
        if (error._body instanceof String){
            let e:RestAPIException = JSON.parse(error._body)
            errMsg = e.message;          
        } else {
            errMsg = (error.message) ? error.message :
            error.status ? `Status: ${error.status} - Text: ${error.statusText}` : 'Server error';
        }
        console.error(errMsg); // log to console instead
 
        //return Observable.throw(errMsg);
 */
        return Observable.throw(error.json().message);
    }
}
