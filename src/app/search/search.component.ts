import {Component} from '@angular/core';
import {SearchService} from './search.service';
import {SearchRequest} from './model/search-request';
import {SearchResponseList} from './model/search-response-list';
import deepEqual = require('deep-equal'); // tslint:disable-line
import {SearchResponse} from './model/search-response';
import {Base64} from '../core/base64';

const MAX_RESPONSE_ITEMS_PER_REQUEST_COUNT: number = 20;

@Component({
    selector: 'search-component',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
    private currentMedia: SearchResponse;
    private searchRequest: SearchRequest;
    private searchRequestIndex: number;
    private searchResponseList: SearchResponseList;
    private loadingResponseList: boolean;

    constructor(private searchService: SearchService) {
        this.searchResponseList = new SearchResponseList();
        this.searchResponseList.items = [];
    }

    private addSearchRequest(text: string): void {
        if (text === '') {
            return;
        }

        const self = this;
        text = Base64.Encode(text.trim().toLowerCase());

        self.searchService.addSearchRequest(text)
            .then((r) => {
                self.searchRequest = new SearchRequest(text);
                self.searchRequestIndex = 0;
                self.searchResponseList.items = [];

                self.getSearchResponseList();
            })
            .catch((e) => console.log('Request AddSearchRequest failed: ' + e.toString()));
    }

    private getSearchResponseList(): void {
        const self = this;
        const request = self.searchRequest;

        if (!request || request.text === '') {
            this.loadingResponseList = false;
            return;
        }

        this.loadingResponseList = true;

        self.searchService.getSearchResponseList(request,
            self.searchRequestIndex * MAX_RESPONSE_ITEMS_PER_REQUEST_COUNT,
            MAX_RESPONSE_ITEMS_PER_REQUEST_COUNT)
            .then((r) => {
                const res: SearchResponseList = r.data;
                if (r.status === 404) {
                    self.loadingResponseList = false;
                    return;
                }

                if (res.items) {
                    res.items = res.items.filter((v) => {
                        for (const item of self.searchResponseList.items) {
                            if (deepEqual(v, item)) {
                                return false;
                            }
                        }
                        return true;
                    });

                    if (res.items.length > 0) {
                        self.searchResponseList.items.push(...res.items);
                        console.log('Incoming items count: ' + res.items.length);
                    }
                }

                const requestIndex: number = Math.trunc(self.searchResponseList.items.length / MAX_RESPONSE_ITEMS_PER_REQUEST_COUNT);
                if (self.searchRequestIndex <= requestIndex) {
                    setTimeout(() => {
                        self.getSearchResponseList();
                    }, 1000);
                } else {
                    self.loadingResponseList = false;
                }
            })
            .catch((e) => {
                console.log('Request GetSearchResponseList failed: ' + e.toString());
                self.loadingResponseList = false;
            });
    }
}
