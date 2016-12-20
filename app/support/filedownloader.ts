import { Observable } from 'rxjs/Observable';
import { HttpModule, Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { Configuration } from './configuration';

export class FileDownloader{
    constructor(private http: Http, private settings : Configuration) {}
    private downloadFile(downloadURL:string): Observable<Blob> {
        let txtCsvOptions = new RequestOptions({ headers: new Headers({
                                                                        'Content-Type': 'application/json',
                                                                        'Accept': 'text/csv',
                                                                        'Authorization': localStorage.getItem('JWTToken')
                                                                    }),
                                                                        responseType: ResponseContentType.Blob
                                                                });
    return this.http.post(this.settings.createBackendURLFor(downloadURL), '', txtCsvOptions)
        .map(response=><Blob>response.blob())
        .catch(this.handleError);
    }

    public downloadData(exportFilename:string, url:string){
        if (exportFilename == undefined)
            exportFilename = "nofilename.tmp";
        this.downloadFile(url)
            .subscribe(data => {
                if (navigator.msSaveBlob) {
                    // IE11 - actually better than Chrome & FF!!
                    navigator.msSaveBlob(data, exportFilename);
                } else {
                    // create a link in the DOM
                    var link = document.createElement('a');
                    // set its URL to point at the Blob returned by our service
                    link.href = window.URL.createObjectURL(data);
                    // set the link as a download
                    link.setAttribute('download', exportFilename);
                    // insert it into the DOM
                    document.body.appendChild(link);    
                    // activate the link to save the file
                    link.click();
                    // remove the link from the DOM
                    document.body.removeChild(link);
                }            
            },
            error => console.log("Error downloading the file."),
            () => console.log('Completed file download.'));
    }

    private handleError (error: any) {
        // TODO: seems we cannot use messageService from here...
        let errMsg = (error.message) ? error.message :
        error.status ? `Status: ${error.status} - Text: ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
    
}