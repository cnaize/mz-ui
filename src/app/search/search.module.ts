import {NgModule} from '@angular/core';
import {SearchService} from './search.service';
import {Config} from '../core/config';

@NgModule({
    declarations: [
    ],
    providers: [
        SearchService,
        Config,
    ],
})

export class SearchModule { }
