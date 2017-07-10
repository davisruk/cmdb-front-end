import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { MessageService} from '../../service/message.service';
import {ServerConfig} from './serverConfig';
import {ServerConfigService} from './serverConfig.service';
import {Server} from '../server/server';
import { SecurityHelper } from '../../support/security-helper';
import { FieldValidationTags, HieraTag, HieraRefresh,HieraTagCollection } from '../../support/hiera-tag-support';

// Value accessor that allows sub components to alter 
// this component's model without using emit
export const SERVER_CONFIG_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ServerConfigDetailComponent),
    multi: true
};

@Component({
    moduleId: module.id,
	templateUrl: 'serverConfig-detail.component.html',
	selector: 'serverConfig-detail',
})
export class ServerConfigDetailComponent implements OnInit, OnDestroy, ControlValueAccessor {
    serverConfig : ServerConfig;

    private params_subscription: any;
    private allowWriteSensitive: boolean;
    private enableCreateFrom: boolean;
    private invalidHieraTags:FieldValidationTags;
    private displayHieraTags:HieraTagCollection;

    @Input() sub : boolean = false;
    @Input() // used to pass the parent when creating a new ServerConfig
    set server(server : Server) {
        this.serverConfig = new ServerConfig();
        this.serverConfig.server = server;
    }

    @Output() onSaveClicked = new EventEmitter<ServerConfig>();
    @Output() onCancelClicked = new EventEmitter();

    constructor(private route: ActivatedRoute, private router: Router, private messageService: MessageService, private serverConfigService: ServerConfigService) {
    }

    ////////////////////////////////////////////////
    //
    //  Value Accessor callbacks for sub components
    //
    ////////////////////////////////////////////////
    
    //Placeholders for the callbacks
    private onTouchedCallback: () => void = () => {};
    private onChangeCallback: (_:any) => void = () => {};
    
    // Control Value Accessor implementation
    get value(): any { return this.serverConfig };
    set value(v: any) {
        this.serverConfig = <ServerConfig> v;
        this.onChangeCallback(v);
    }

    //Set touched on blur
    onTouched(){
        this.onTouchedCallback();
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        this.serverConfig = <ServerConfig> value;
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
    
    ////////////////////////////////////////////////
    //
    //  End of Value Accessor callbacks
    //
    ////////////////////////////////////////////////

    ngOnInit() {
        if (this.sub) {
            return;
        }
        //Setup invalid tags for fields
        this.invalidHieraTags = new FieldValidationTags();
        this.invalidHieraTags.paramTags.push(new HieraTag("ParamName", false, false));
        // setup hiera component fields to display
        this.displayHieraTags = new HieraTagCollection();
        this.displayHieraTags.tags.push(new HieraTag(HieraTag.PARAM, false, false));
        this.displayHieraTags.tags.push(new HieraTag(HieraTag.RELEASE, false, false));
        this.displayHieraTags.tags.push(new HieraTag(HieraTag.ENVID, false, false));
        this.displayHieraTags.tags.push(new HieraTag(HieraTag.SUBENV, false, false));
        this.displayHieraTags.tags.push(new HieraTag(HieraTag.SERVER, false, false));
        this.displayHieraTags.tags.push(new HieraTag(HieraTag.SERVER_TYPE, false, false));
        
        this.params_subscription = this.route.params.subscribe(params => {
            let id = params['id'];
            console.log('ngOnInit for serverConfig-detail ' + id);

            if (id === 'new') {
                this.serverConfig = new ServerConfig();
                this.enableCreateFrom = false;
                this.buildHieraTags();
            } else {
                this.enableCreateFrom = true;
                this.serverConfigService.getServerConfig(id)
                    .subscribe(
                        serverConfig => {
                            this.serverConfig = serverConfig;
                            this.buildHieraTags();
                        },
                        error =>  this.messageService.error('ngOnInit error', error)
                    );
            }
        });
        
        this.allowWriteSensitive = new SecurityHelper().userHasWriteSensitive();         
    }

    private buildHieraTags (){
        // this is actually quicker than using ngDoCheck in hiera-config.component
        // ngOnChange will detect a reference change but not a change to the
        // internal array. ngDoCheck is called constantly so it's best to build
        // the array each time.
        this.displayHieraTags = new HieraTagCollection();
        this.displayHieraTags.tags.push(new HieraTag(HieraTag.PARAM, false, false));
        this.displayHieraTags.tags.push(new HieraTag(HieraTag.RELEASE, false, false));
        this.displayHieraTags.tags.push(new HieraTag(HieraTag.ENVID, false, false));
        this.displayHieraTags.tags.push(new HieraTag(HieraTag.SUBENV, false, false));
        this.displayHieraTags.tags.push(new HieraTag(HieraTag.SERVER, false, false));
        this.displayHieraTags.tags.push(new HieraTag(HieraTag.SERVER_TYPE, false, false));
    }

    ngOnDestroy() {
        if (!this.sub) {
            this.params_subscription.unsubscribe();
        }
    }

    gotoServer() {
        this.router.navigate(['/server', this.serverConfig.server.id]);
    }

    clearServer() {
        this.serverConfig.server = null;
    }

    onSave() {
        this.serverConfigService.update(this.serverConfig).
            subscribe(
                serverConfig => {
                    this.serverConfig = serverConfig;
                    if (this.sub) {
                        this.onSaveClicked.emit(this.serverConfig);
                        this.messageService.info('Saved OK and msg emitted', 'PrimeNG Rocks ;-)')
                    } else {
                        this.messageService.info('Saved OK', 'PrimeNG Rocks ;-)')
                    }
                    this.enableCreateFrom = true;
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

    onCreateFrom(){
        this.serverConfig.id = undefined;
        this.enableCreateFrom = false;
    }

}
