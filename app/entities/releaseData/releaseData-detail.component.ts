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
import {ReleaseData} from './releaseData';
import {ReleaseDataService} from './releaseData.service';
import {Release} from '../release/release';
import {ReleaseDataType} from '../releaseDataType/releaseDataType';

@Component({
    moduleId: module.id,
	templateUrl: 'releaseData-detail.component.html',
	selector: 'releaseData-detail',
})
export class ReleaseDataDetailComponent implements OnInit, OnDestroy {
    releaseData : ReleaseData;

    private params_subscription: any;


    @Input() sub : boolean = false;
    @Input() // used to pass the parent when creating a new ReleaseData
    set release(release : Release) {
        this.releaseData = new ReleaseData();
        this.releaseData.release = release;
    }

    @Input() // used to pass the parent when creating a new ReleaseData
    set dataType(dataType : ReleaseDataType) {
        this.releaseData = new ReleaseData();
        this.releaseData.dataType = dataType;
    }

    @Output() onSaveClicked = new EventEmitter<ReleaseData>();
    @Output() onCancelClicked = new EventEmitter();

    constructor(private route: ActivatedRoute, private router: Router, private messageService: MessageService, private releaseDataService: ReleaseDataService) {
    }

    ngOnInit() {
        if (this.sub) {
            return;
        }

        this.params_subscription = this.route.params.subscribe(params => {
            let id = params['id'];
            console.log('ngOnInit for releaseData-detail ' + id);

            if (id === 'new') {
                this.releaseData = new ReleaseData();
            } else {
                this.releaseDataService.getReleaseData(id)
                    .subscribe(
                        releaseData => this.releaseData = releaseData,
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

    gotoRelease() {
        this.router.navigate(['/release', this.releaseData.release.id]);
    }

    clearRelease() {
        this.releaseData.release = null;
    }

    gotoDataType() {
        this.router.navigate(['/releaseDataType', this.releaseData.dataType.id]);
    }

    clearDataType() {
        this.releaseData.dataType = null;
    }

    onSave() {
        this.releaseDataService.update(this.releaseData).
            subscribe(
                releaseData => {
                    this.releaseData = releaseData;
                    if (this.sub) {
                        this.onSaveClicked.emit(this.releaseData);
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

}
