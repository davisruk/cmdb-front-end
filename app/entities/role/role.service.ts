import { Injectable } from '@angular/core';
import { HttpModule, Http, Response, Headers, RequestOptions } from '@angular/http';
import { LazyLoadEvent } from 'primeng/primeng';
import { Observable } from 'rxjs/Observable';
import { MessageService } from '../../service/message.service';
import { PageResponse, PageRequestByExample } from '../../support/paging';
import { Role } from './role';
import { User } from '../user/user';

@Injectable()
export class RoleService {

    private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('JWTToken')}) });

    constructor(private http: Http, private messageService : MessageService) {}

    /**
     * Get a ServerType by id.
     */
    getRole(id : any) : Observable<Role> {
        return this.http.get('http://localhost:8080/api/roles/' + id, this.options)
            .map(response => <Role> response.json())
            .catch(this.handleError);
    }

    // not using the /api so we're not just getting Role[] but full HATEOS json
    // need to extract the Role[]
    getAssignedRolesForUser(user : User) : Observable<Role[]>{
        return this.http.get('http://localhost:8080/users/' + user.id + '/roles', this.options)
            .map(response => <Role[]> response.json()._embedded.roles)
            .catch(this.handleError);
    }    

    // not using the /api so we're not just getting Role[] but full HATEOS json
    // need to extract the Role[]
    getUnassignedRolesForUser(user : User) : Observable<Role[]>{
        return this.http.get('http://localhost:8080/api/unassignedrolesforuser/' + user.id, this.options)
            .map(response => <Role[]> response.json())
            .catch(this.handleError);
    }    

    /**
     * Update the passed serverType.
     */
    update(role : Role) : Observable<Role> {
        let body = JSON.stringify(role);

        return this.http.put('http://localhost:8080/api/roles/', body, this.options)
            .map(response => <Role> response.json())
            .catch(this.handleError);
    }

    /**
     * Load a page (for paginated datatable) of ServerType using the passed
     * serverType as an example for the search by example facility.
     */
    getPage(role : Role, event : LazyLoadEvent) : Observable<PageResponse<Role>> {
        let req = new PageRequestByExample(role, event);
        let body = JSON.stringify(req);

        return this.http.post('http://localhost:8080/api/roles/page', body, this.options)
            .map(response => {
                let pr = <PageResponse<Role>> response.json();
                return new PageResponse<Role>(pr.totalPages, pr.totalElements, pr.content);
            })
            .catch(this.handleError);
    }

    /**
     * Performs a search by example on 1 attribute (defined on server side) and returns at most 10 results.
     * Used by ServerTypeCompleteComponent.
     */
    complete(query : string) : Observable<Role[]> {
        let body = JSON.stringify({'query': query, 'maxResults': 10});
        return this.http.post('http://localhost:8080/api/roles/complete', body, this.options)
            .map(response => <Role[]> response.json())
            .catch(this.handleError);
    }

    /**
     * Delete an ServerType by id.
     */
    delete(id : any) {
        return this.http.delete('http://localhost:8080/api/roles/' + id, this.options).catch(this.handleError);
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
