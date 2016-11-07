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
import {SolutionComponent} from './solutionComponent';
import {SolutionComponentService} from './solutionComponent.service';
import {PackageInfo} from '../packageInfo/packageInfo';
import {HieraValues} from '../hiera/hieravalues';

@Component({
    moduleId: module.id,
	templateUrl: 'solutionComponent-detail.component.html',
	selector: 'solutionComponent-detail',
})
export class SolutionComponentDetailComponent implements OnInit, OnDestroy {
    solutionComponent : SolutionComponent;

    private params_subscription: any;
    private hieraValuesList: HieraValues[];

    @Input() sub : boolean = false;
    @Input() // used to pass the parent when creating a new SolutionComponent
    set packageInfo(packageInfo : PackageInfo) {
        this.solutionComponent = new SolutionComponent();
        this.solutionComponent.packageInfo = packageInfo;
    }

    @Output() onSaveClicked = new EventEmitter<SolutionComponent>();
    @Output() onCancelClicked = new EventEmitter();

    constructor(private route: ActivatedRoute, private router: Router, private messageService: MessageService, private solutionComponentService: SolutionComponentService) {
    }

    ngOnInit() {
        if (this.sub) {
            return;
        }

        this.params_subscription = this.route.params.subscribe(params => {
            let id = params['id'];
            console.log('ngOnInit for solutionComponent-detail ' + id);

            if (id === 'new') {
                this.solutionComponent = new SolutionComponent();
            } else {
                this.solutionComponentService.getSolutionComponent(id)
                    .subscribe(
                        solutionComponent => {
                            this.solutionComponent = solutionComponent;
                            this.solutionComponentService.getHieraValues(this.solutionComponent.id).subscribe(p => this.hieraValuesList = p)},
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

    gotoPackageInfo() {
        this.router.navigate(['/packageInfo', this.solutionComponent.packageInfo.id]);
    }

    clearPackageInfo() {
        this.solutionComponent.packageInfo = null;
    }

    onSave() {
        this.solutionComponentService.update(this.solutionComponent).
            subscribe(
                solutionComponent => {
                    this.solutionComponent = solutionComponent;
                    if (this.sub) {
                        this.onSaveClicked.emit(this.solutionComponent);
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
        window.location.href='http://localhost:8080/api/solutionComponents/configdownload/' + this.solutionComponent.id;
    }
}
