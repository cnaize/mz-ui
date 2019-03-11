import {Component} from '@angular/core';
import {SearchService} from './search.service';
import {SearchRequest} from './model/search-request';
import {SearchResponseList} from './model/search-response-list';
import deepEqual = require('deep-equal'); // tslint:disable-line
import {Base64} from '../core/base64';
import {Bag} from '../core/bag';
import {User} from '../user/model/user';
import {Media} from './model/media';
import {SearchResponse} from './model/search-response';

const MAX_RESPONSE_ITEMS_PER_REQUEST_COUNT: number = 20;

@Component({
    selector: 'search-component',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
    public searchRequest: SearchRequest;
    public searchResponseList: SearchResponseList;
    public loadingResponseList: boolean;

    private searchRequestIndex: number;

    constructor(public bag: Bag, private searchService: SearchService) {
        this.searchResponseList = new SearchResponseList();
        this.searchResponseList.items = [];

        // NOTE: REMOVE IT!!!
        const u1 = new User();
        u1.username = 'cnaize';
        const u2 = new User();
        u2.username = 'slash';
        const m1 = new Media();
        m1.name = 'Chaze - Think';
        m1.dir = 'Chaze/Discography/Think 2019';
        m1.ext = 'mp3';
        const m2 = new Media();
        m2.name = 'Feel Free - Mind';
        m2.dir = 'Feel Free/Mind (2019)';
        m2.ext = 'mp3';
        const r1 = new SearchResponse();
        r1.owner = u1;
        r1.media = m1;
        const r2 = new SearchResponse();
        r2.owner = u2;
        r2.media = m2;
        this.searchResponseList.items = [r1, r2];
    }

    public addSearchRequest(text: string): void {
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

    private loadMoreSearchResponseList(): void {
        const self = this;
        const request = self.searchRequest;

        if (!request || request.text === '') {
            this.loadingResponseList = false;
            return;
        }

        this.loadingResponseList = true;

        self.searchService.addSearchRequest(request.text)
            .then((r) => {
                self.searchRequestIndex = 0;

                self.getSearchResponseList();
            })
            .catch((e) => {
                console.log('Request LoadMoreSearchResponseList failed: ' + e.toString());
                self.loadingResponseList = false;
            });
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
                            if (self.deepEqual(v, item)) {
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

    private deepEqual(actual: any, expected: any): boolean {
        return deepEqual(actual, expected);
    }
}
