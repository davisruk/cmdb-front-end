import { Component,OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpModule, RequestOptions, Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Message, MenuItem } from 'primeng/primeng';
import { MessageService} from './service/message.service';
import { Authority } from './entities/role/authority';
import { LoginDetails } from './entities/authentication/login-details';
import { Configuration } from './support/configuration';
import { SecurityHelper } from './support/security-helper';
import {enableProdMode} from '@angular/core';

enableProdMode();
/**
 * The Root component. Defines the main layout and handles user login in a dialog.
 */
@Component({
    selector: 'my-app',
    template: `
        <p-growl [value]="msgs"></p-growl>

        <div class="ui-g layout">
            <div *ngIf="authenticated" class="ui-g-12 ui-md-1">Sidebar</div>
            <div class="ui-g-12 ui-md-11 ui-g-nopad">
                <div  *ngIf="authenticated" class="ui-g-12 ui-g-nopad">
                    <p-menubar [model]="items"></p-menubar>
                </div>
                <div class="ui-g-12">
                    <router-outlet></router-outlet>
                </div>
                <div class="ui-g-12" style="text-align: center;">
                    <i class="fa fa-twitter"></i> <a href="https://twitter.com/davisr_uk">@davisr_uk</a> -
                    <i class="fa fa-github-alt"></i> <a href="https://github.com/davisruk/cmdb-front-end">https://github.com/davisruk/cmdb-front-end</a>
                </div>
            </div>
        </div>
        <p-dialog header="Please login" width="400" [visible]="displayLoginDialog" [responsive]="true" showEffect="fade" [modal]="true" [closable]="false" *ngIf="!authenticated">
            <div ngForm class="ui-g">
                <div class="ui-g-12" *ngIf="loginFailed">
                    <div class="ui-message ui-messages-error ui-corner-all">
                        Invalid login or password
                    </div>
                </div>
                <div class="ui-g-12">
                    <div class="ui-g-4">
                        <label for="j_username">Username</label>
                    </div>
                    <div class="ui-g-8">
                        <input pInputText id="j_username" [(ngModel)]="j_username" name="username"/>
                    </div>
                </div>
                <div class="ui-g-12">
                    <div class="ui-g-4">
                        <label for="j_password">Password</label>
                    </div>
                    <div class="ui-g-8">
                        <input type="password" pPassword id="j_password" [(ngModel)]="j_password" name="password"/>
                    </div>
                </div>
            </div>
            <footer>
                <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">
                    <button type="submit" pButton (click)="login()" icon="fa-sign-in" label="Login"></button>
                </div>
            </footer>
        </p-dialog>
               `,
    styles:[`
        .layout div {
            background-color: white;
            border: 1px solid #f5f7f8;
        }
    `]
})
export class AppComponent implements OnInit {
    //private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' })});
    private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });
    private items : MenuItem[] = [{label: 'hello'}];
    msgs : Message[] = [];

    displayLoginDialog : boolean = true;
    loginFailed : boolean = false;
    authenticated : boolean = false;
    userAuthorities : Authority[];
    isAdmin: boolean = false;
    j_username : string = "";
    j_password : string = "";
    token : string ="";

    constructor(private http: Http, private messageService: MessageService,
                private router: Router, private settings:Configuration) {
        messageService.messageSource$.subscribe(
            msg => {
                this.msgs.push(msg);
            });
    }

    ngOnInit() {
        this.items = [
            { label: 'Home', routerLink: ['/'], icon: 'fa-home' },

            { label: 'Entities', icon: 'fa-search', items: [
                {label: 'ComponentConfig List', routerLink: ['/componentConfig-list']},
                {label: 'Environment List', routerLink: ['/environment-list']},
                {label: 'SubEnvironmentConfig List', routerLink: ['/subEnvironmentConfig-list']},
                {label: 'Globalconfig List', routerLink: ['/globalconfig-list']},
                {label: 'PackageInfo List', routerLink: ['/packageInfo-list']},
                {label: 'PackageType List', routerLink: ['/packageType-list']},
                {label: 'Release List', routerLink: ['/release-list']},
                {label: 'ReleaseData List', routerLink: ['/releaseData-list']},
                {label: 'ReleaseDataType List', routerLink: ['/releaseDataType-list']},
                {label: 'Server List', routerLink: ['/server-list']},
                {label: 'ServerConfig List', routerLink: ['/serverConfig-list']},
                {label: 'ServerType List', routerLink: ['/serverType-list']},
                {label: 'SolutionComponent List', routerLink: ['/solutionComponent-list']},
                {label: 'ReleaseConfig List', routerLink: ['/releaseConfig-list']},
                ]
            },
            { label: 'Swagger', command: (swagger)=>this.openSwagger(), icon: 'fa-gear' },
            { label: 'Documentation',
                icon: 'fa-book',
                items: [
                    {label: "Source code", icon: 'fa-github-alt', url:"https://github.com/davisruk/cmdb-front-end"},
                    {label: "PrimeNG Showcase", icon: 'fa-external-link', url:"http://www.primefaces.org/primeng"},
                    {label: "Angular JS 2", icon: 'fa-external-link', url:"http://angular.io/"},
                    {label: "Spring Boot", icon: 'fa-external-link', url:"http://projects.spring.io/spring-boot/"},
                    {label: "Spring Data JPA", icon: 'fa-external-link', url:"http://projects.spring.io/spring-data-jpa/"},
                    {label: "TypeScript", icon: 'fa-external-link', url:"https://www.typescriptlang.org/"}
                ]
            }
        ];
    }

    login() {
        console.log("login for " + this.j_username);
        let loginData = new LoginDetails(this.j_username, this.j_password);
        let body = JSON.stringify(loginData)
        this.http.post(this.settings.createBackendURLFor('api/login'), body, this.options).
        map( res => res.json()).catch(this.handleError).
        subscribe(
            tokenRes => {
                        if (tokenRes != undefined) {
                            this.displayLoginDialog = false;
                            this.authenticated = true;
                            this.items.push({label: 'Sign out', command: (logout)=>this.logout(), icon: 'fa-sign-out' });
                            this.loginFailed = false;
                            this.messageService.info('You are now logged in.', '');
                            localStorage.setItem('JWTToken', tokenRes.token);
                            this.processUserRights();
                        } else {
                            this.loginFailed = true;
                            this.displayLoginDialog = true;
                            this.authenticated = false;
                        }
                    },
            error =>    {
                            this.messageService.error('Login error', error);
                            this.loginFailed = true;
                            this.displayLoginDialog = true;
                            this.authenticated = false;
                        }
        );
    }

    processUserRights()
    {
        this.isAdmin = new SecurityHelper().userIsAdmin();
        if (this.isAdmin)
            this.items.splice(4,0,{ label: 'Admin',
                icon: 'fa-gears',
                items: [
                    {label: "Roles", icon: 'fa-unlock-alt', routerLink: ['/role-list']},
                    {label: "Users", icon: 'fa-users', routerLink: ['/user-list']},
                ]
            }
        )
    }

    logout(){
        this.items.pop;
        localStorage.removeItem ("JWTToken");
        this.isAdmin = false;
        this.authenticated = false;
        // window.location.href=this.settings.createFrontendURLFor('logout.html');
        this.router.navigate(['/logout']);
    }
    // sample method from angular doc
    private handleError (error: any) {
        let errMsg = (error.message) ? error.message :
        error.status ? `Status: ${error.status} - Text: ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    openSwagger(){
        window.open(this.settings.createBackendURLFor('swagger-ui.html'));
    }
}
