import {Component} from '@angular/core';
import {SearchService} from './search.service';
import {SearchRequest} from './model/search-request';
import {SearchResponseList} from './model/search-response-list';
import deepEqual = require('deep-equal'); // tslint:disable-line
import {SearchResponse} from './model/search-response';

@Component({
    selector: 'search-component',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})

export class SearchComponent {
    private currentMedia: SearchResponse;
    private searchRequest: SearchRequest;
    private searchResponseList: SearchResponseList;

    constructor(private searchService: SearchService) {
        this.searchResponseList = new SearchResponseList();
        this.searchResponseList.items = [];

        this.refreshLoop();
    }

    private refreshLoop(): void {
        const self = this;

        self.getSearchResponseList(self.searchRequest);

        setTimeout(() => {
            self.refreshLoop();
        }, 1000);
    }

    private addSearchRequest(text: string): void {
        if (text === '') {
            return;
        }

        const self = this;
        self.searchService.addSearchRequest(text)
            .then((r) => {
                const res: SearchRequest = r.data;
                if (r.status !== 201) {
                    console.log('Request AddSearchRequest failed: ' + r.statusText + ' - ' + res.error.str);
                    return;
                }

                self.searchResponseList.items = [];
                self.searchRequest = res;
            })
            .catch((e) => console.log('Request AddSearchRequest failed: ' + e.toString()));
    }

    private getSearchResponseList(request: SearchRequest): void {
        if (!request || request.text === '') {
            return;
        }

        const self = this;
        self.searchService.getSearchResponseList(request.text)
            .then((r) => {
                const res: SearchResponseList = r.data;

                if (r.status !== 200) {
                    console.log('Request SearchResponseList failed: ' + r.statusText + ' - ' + res.error.str);
                    return;
                }
                if (!res.items) {
                    return;
                }
                if (res.request.text !== request.text) {
                    return;
                }

                res.items = res.items.filter((v) => {
                    for (const item of self.searchResponseList.items) {
                        if (deepEqual(v, item)) {
                            return false;
                        }
                    }
                    return true;
                });

                self.searchResponseList.items.push(...res.items);
            });
    }
}
