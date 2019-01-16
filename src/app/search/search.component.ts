import {Component} from '@angular/core';
import {SearchService} from './search.service';
import {SearchRequest} from './model/search-request';
import {AxiosPromise} from 'axios';
import {SearchResponseList} from './model/search-response-list';
import deepEqual = require('deep-equal'); // tslint:disable-line

@Component({
    selector: 'search-component',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})

export class SearchComponent {
    private searchText: string = '';
    private searchResponseList: SearchResponseList;

    private searchAddReqPromise: AxiosPromise<SearchRequest>;
    private searchRespListPromise: AxiosPromise<SearchResponseList>;

    constructor(private searchService: SearchService) {
        this.searchResponseList = new SearchResponseList();
        this.searchResponseList.items = [];

        this.refreshLoop();
    }

    private refreshLoop(): void {
        const self = this;

        self.getSearchResponseList(self.searchText);

        setTimeout(() => {
            self.refreshLoop();
        }, 1000);
    }

    private addSearchRequest(text: string): void {
        if (text === '' || text === this.searchText || this.searchAddReqPromise) {
            return;
        }

        const self = this;
        self.searchAddReqPromise = self.searchService.addSearchRequest(text);

        self.searchAddReqPromise
            .then((r) => {
                const res: SearchRequest = r.data;

                if (r.status !== 201) {
                    console.log('Request AddSearchRequest failed: ' + r.statusText + ' - ' + res.error.str);
                    return;
                }
                self.searchResponseList.items = [];
                self.searchText = text;
            })
            .catch((e) => console.log('Request AddSearchRequest failed: ' + e.toString()))
            .then(self.searchAddReqPromise = null);
    }

    private getSearchResponseList(text: string): void {
        if (text === '' || this.searchRespListPromise) {
            return;
        }

        const self = this;
        self.searchRespListPromise = self.searchService.getSearchResponseList(text);

        self.searchRespListPromise
            .then((r) => {
                const res: SearchResponseList = r.data;

                if (r.status !== 200) {
                    console.log('Request SearchResponseList failed: ' + r.statusText + ' - ' + res.error.str);
                    return;
                }
                if (!res.items) {
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
            })
            .then(self.searchRespListPromise = null);
    }

    private test(): void {
        console.log('HERE');
    }
}
