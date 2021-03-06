//
// Source code generated by Celerio, a Jaxio product.
// Documentation: http://www.jaxio.com/documentation/celerio/
// Follow us on twitter: @jaxiosoft
// Need commercial support ? Contact us: info@jaxio.com
// Template pack-angular:src/main/webapp/app/entities/entity-detail.component.ts.e.vm
//
import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { MessageService} from '../../service/message.service';
import {Release} from './release';
import {ReleaseService} from './release.service';
import {HieraValues} from '../hiera/hieraValues';
import { Configuration } from '../../support/configuration';
@Component({
    moduleId: module.id,
	templateUrl: 'release-detail.component.html',
	selector: 'release-detail',
})
export class ReleaseDetailComponent implements OnInit, OnDestroy {
    release : Release;

    private params_subscription: any;
    private hieraValuesList: HieraValues[];


    @Input() sub : boolean = false;
    @Output() onSaveClicked = new EventEmitter<Release>();
    @Output() onCancelClicked = new EventEmitter();

    constructor(private route: ActivatedRoute, private router: Router, 
                private messageService: MessageService, private releaseService: ReleaseService,
                private settings : Configuration) {
    }

    ngOnInit() {
        if (this.sub) {
            return;
        }

        this.params_subscription = this.route.params.subscribe(params => {
            let id = params['id'];
            console.log('ngOnInit for release-detail ' + id);

            if (id === 'new') {
                this.release = new Release();
            } else {
                this.releaseService.getRelease(id)
                    .subscribe(
                        release => {this.release = release,
                            this.releaseService.getHieraValues(this.release.name).subscribe(p => this.hieraValuesList = p)},
                        error =>  this.messageService.error('ngOnInit error', error)

                    );
            }
        });
    }

    ngOnDestroy() {
        if (!this.sub) {
            this.params_subscription.unsubscribe();
        }
    }

    onSave() {
        this.releaseService.update(this.release).
            subscribe(
                release => {
                    this.release = release;
                    if (this.sub) {
                        this.onSaveClicked.emit(this.release);
                        this.messageService.info('Saved OK and msg emitted', 'PrimeNG Rocks ;-)')
                    } else {
                        this.messageService.info('Saved OK', 'PrimeNG Rocks ;-)')
                    }
                },
                error =>  this.messageService.error('Could not save', error)
            );
    }

    onCancel() {
        if (this.sub) {
            this.onCancelClicked.emit("cancel");
            this.messageService.info('Cancel clicked and msg emitted', 'PrimeNG Rocks ;-)')
        }
    }

    onDownload(){
        window.location.href=this.settings.createBackendURLFor('api/releases/configdownload/' + this.release.name);
/*
        this.releaseService.downloadHieraCSV(this.release.name)
      .subscribe(data => window.open(window.URL.createObjectURL(data)),
                  error => console.log("Error downloading the file."),
                  () => console.log('Completed file download.'));
  */      
    }
    onDownloadAll(){
        window.location.href=this.settings.createBackendURLFor('api/releases/configdownloadall/' + this.release.name);
    }
}
