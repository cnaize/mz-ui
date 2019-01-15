import {Component} from '@angular/core';
import {SearchService} from './search.service';

@Component({
    selector: 'search-component',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css'],
})

export class SearchComponent {
    private searchText: string;

    constructor(private searchService: SearchService) {
    }

    private search(text: string): void {
        this.searchService.getSearches();
    }
}
