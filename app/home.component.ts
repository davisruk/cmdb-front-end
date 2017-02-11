import { Component } from '@angular/core';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html',
    styles: [`
             h3 {color: blue;}
             h4 {color: green;}
             .ui-g {
                text-align: center;
                background-color: aliceblue;}
             `]
})
export class HomeComponent {
}
