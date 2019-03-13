import {Component} from '@angular/core';
import {Page} from '../core/page';

@Component({
    selector: 'user-component',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
})
export class UserComponent extends Page {

    constructor() {
        super('user');
    }
}
