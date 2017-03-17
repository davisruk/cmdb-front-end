import { Observable } from 'rxjs/Observable';

export interface RefreshService {
    refreshData(id:any):Observable<any>;
}