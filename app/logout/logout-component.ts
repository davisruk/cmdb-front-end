import {Component, OnInit, Input} from '@angular/core';
import {Configuration} from '../support/configuration';
@Component({
    moduleId: module.id,
	templateUrl: 'logout.html',
	selector: 'logout'
    
})
export class LogoutComponent implements OnInit{
    constructor (private settings:Configuration){}
    @Input()
    loginUrl : string;

    ngOnInit (){
        this.loginUrl = this.settings.createFrontendURLFor('');
    }
}