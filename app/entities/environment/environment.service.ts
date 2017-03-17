import { Injectable } from '@angular/core';
import { HttpModule, Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { LazyLoadEvent } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';
import { MessageService } from '../../service/message.service';
import { PageResponse, PageRequestByExample } from '../../support/paging';
import { Environment, EnvironmentType } from './environment';
import { SubEnvironment, SubEnvironmentType } from './subEnvironment';
import { Server } from '../server/server';
import { HieraValues } from '../hiera/hieraValues';
import { Configuration } from '../../support/configuration';
import { FileDownloader } from '../../support/filedownloader';
import { RefreshService } from '../../support/refresh.service';

@Injectable()
export class EnvironmentService implements RefreshService {

    private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('JWTToken')}) });
    
    constructor(private http: Http, private messageService : MessageService, private settings : Configuration) {}

    refreshData(id : any) : Observable<any> {
        return this.getEnvironment(id);
    }    
    /**
     * Get a Environment by id.
     */
    getEnvironment(id : any) : Observable<Environment> {
        return this.http.get(this.settings.createBackendURLFor('api/environments/' + id), this.options)
            .map(response => <Environment> response.json())
            .catch(this.handleError);
    }

    getAll() : Observable<Environment[]> {
        return this.http.get(this.settings.createBackendURLFor('api/environments/'), this.options)
            .map(response => <Environment[]> response.json())
            .catch(this.handleError);
    }
    
    getAllSubEnvs() : Observable<SubEnvironment[]> {
        return this.http.get(this.settings.createBackendURLFor('api/subenvironments/all'), this.options)
            .map(response => <SubEnvironment[]> response.json())
            .catch(this.handleError);
    }

    getSubEnvsWithoutServer(server:Server) : Observable<SubEnvironment[]> {
        let body = JSON.stringify(server);
        return this.http.post(this.settings.createBackendURLFor('api/subenvironments/withoutServer'), body, this.options)
            .map(response => <SubEnvironment[]> response.json())
            .catch(this.handleError);
    }

    getSubEnvsWithServer(server:Server) : Observable<SubEnvironment[]> {
        let body = JSON.stringify(server);
        return this.http.post(this.settings.createBackendURLFor('api/subenvironments/withServer'), body, this.options)
            .map(response => <SubEnvironment[]> response.json())
            .catch(this.handleError);
    }

    getAllEnvTypes() : Observable<EnvironmentType[]> {
        return this.http.get(this.settings.createBackendURLFor('api/environments/envTypes'), this.options)
            .map(response => {
                let r = response.json()
                return <EnvironmentType[]> r;
            })
            .catch(this.handleError);
    }

    getAvailableSubEnvTypesForEnvWith(subEnv:SubEnvironment) : Observable<SubEnvironmentType[]> {
        let body = JSON.stringify(subEnv);
        return this.http.post(this.settings.createBackendURLFor('api/subenvironments/subEnvTypesAvailableForEnvWithSubEnv'), body, this.options)
            .map(response => {
                let r = response.json()
                return <EnvironmentType[]> r;
            })
            .catch(this.handleError);
    }
    
    getAvailableSubEnvTypesForEnv(env:Environment) : Observable<SubEnvironmentType[]> {
        let body = JSON.stringify(env);
        return this.http.post(this.settings.createBackendURLFor('api/subenvironments/subEnvTypesAvailableForEnv'), body, this.options)
            .map(response => {
                let r = response.json()
                return <EnvironmentType[]> r;
            })
            .catch(this.handleError);
    }

    getHieraValues(name : String) : Observable<HieraValues[]> {
        return this.http.get(this.settings.createBackendURLFor('api/environments/configs/' + name), this.options)
            .map(response => <HieraValues[]> response.json())
            .catch(this.handleError);
    }

    /**
     * Update the passed environment.
     */
    update(environment : Environment) : Observable<Environment> {
        let body = JSON.stringify(environment);

        return this.http.put(this.settings.createBackendURLFor('api/environments/'), body, this.options)
            .map(response => <Environment> response.json())
            .catch(this.handleError);
    }

    updateSubEnvironment(subEnvironment : SubEnvironment) : Observable<SubEnvironment> {
        let body = JSON.stringify(subEnvironment);
        return this.http.put(this.settings.createBackendURLFor('api/subenvironments/'), body, this.options)
            .map(response => <SubEnvironment> response.json())
            .catch(this.handleError);
    }

    /**
     * Load a page (for paginated datatable) of Environment using the passed
     * environment as an example for the search by example facility.
     */
    getPage(environment : Environment, event : LazyLoadEvent) : Observable<PageResponse<Environment>> {
        let req = new PageRequestByExample(environment, event);
        let body = JSON.stringify(req);

        return this.http.post(this.settings.createBackendURLFor('api/environments/page'), body, this.options)
            .map(response => {
                let pr = <PageResponse<Environment>> response.json();
                return new PageResponse<Environment>(pr.totalPages, pr.totalElements, pr.content);
            })
            .catch(this.handleError);
    }

    getSubEnvironmentsNotInListByPage(environment : Environment, event : LazyLoadEvent) : Observable<PageResponse<SubEnvironment>> {
        let req = new PageRequestByExample(environment, event);
        let body = JSON.stringify(req);

        return this.http.post(this.settings.createBackendURLFor('api/environments/notinpageable'), body, this.options)
            .map(response => {
                let pr = <PageResponse<SubEnvironment>> response.json();
                return new PageResponse<SubEnvironment>(pr.totalPages, pr.totalElements, pr.content);
            })
            .catch(this.handleError);
    }

    /**
     * Performs a search by example on 1 attribute (defined on server side) and returns at most 10 results.
     * Used by EnvironmentCompleteComponent.
     */
    complete(query : string) : Observable<Environment[]> {
        let body = JSON.stringify({'query': query, 'maxResults': 10});
        return this.http.post(this.settings.createBackendURLFor('api/environments/complete'), body, this.options)
            .map(response => <Environment[]> response.json())
            .catch(this.handleError);
    }

    completeSubEnv(query : string) : Observable<SubEnvironment[]> {
        let body = JSON.stringify({'query': query, 'maxResults': 10});
        return this.http.post(this.settings.createBackendURLFor('api/subEnvironments/complete'), body, this.options)
            .map(response => <SubEnvironment[]> response.json())
            .catch(this.handleError);
    }

    /**
     * Delete an Environment by id.
     */
    delete(id : any) {
        return this.http.delete(this.settings.createBackendURLFor('api/environments/' + id), this.options).catch(this.handleError);
    }

    // sample method from angular doc
    private handleError (error: any) {
/*
        // TODO: seems we cannot use messageService from here...
        let errMsg = (error.message) ? error.message :
        error.status ? `Status: ${error.status} - Text: ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
*/
        return Observable.throw(error.json().message);
    }

    downloadAllHieraData(filename:string){
        let fileDownloader:FileDownloader = new FileDownloader(this.http, this.settings);
        fileDownloader.downloadData(filename, 'api/environments/configdownloadall', 'text/csv');
    }

    downloadAllHieraDataAsYAML(filename:string){
        let fileDownloader:FileDownloader = new FileDownloader(this.http, this.settings);
        fileDownloader.downloadData(filename, 'api/environments/configdownloadyaml', 'text/plain');
    }

    downloadEnvHieraData(filename:string, envId:number){
        let fileDownloader:FileDownloader = new FileDownloader(this.http, this.settings);
        fileDownloader.downloadData(filename, 'api/environments/configdownloadall/' + envId, 'text/csv');
    }

    downloadEnvHieraYAMLData(filename:string, envName:string){
        let fileDownloader:FileDownloader = new FileDownloader(this.http, this.settings);
        fileDownloader.downloadData(filename, 'api/environments/yaml/' + envName, 'text/plain');
    }

    downloadSubEnvHieraData(filename:string, subEnvId:number){
        let fileDownloader:FileDownloader = new FileDownloader(this.http, this.settings);
        fileDownloader.downloadData(filename, 'api/environments/subconfigdownload/' + subEnvId, 'text/csv');
    }    
}
