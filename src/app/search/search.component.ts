import {Component} from '@angular/core';
import {SearchService} from './search.service';
import {SearchRequest} from './model/search-request';
import {SearchResponseList} from './model/search-response-list';
import deepEqual = require('deep-equal'); // tslint:disable-line
import {Base64} from '../core/base64';
import {Bag} from '../core/bag';
import {SearchResponse} from './model/search-response';
import {Page} from '../core/page';
import {MediaRequest} from './model/media-request';
import {MediaResponseList} from './model/media-response-list';

const MAX_RESPONSE_ITEMS_PER_REQUEST_COUNT: number = 20;

@Component({
    selector: 'search-component',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent extends Page {
    public searchResponseList: SearchResponseList;
    public mediaRequest: MediaRequest;
    public loadingSearchResponse: boolean;
    public loadingMediaResponse: boolean;

    private searchRequest: SearchRequest;
    private searchRequestIndex: number;

    constructor(public bag: Bag, private searchService: SearchService) {
        super('search');

        this.searchResponseList = new SearchResponseList();
        this.searchResponseList.items = [];

        // // NOTE: REMOVE IT!!!
        // const u1 = new User();
        // u1.username = 'cnaize';
        // const u2 = new User();
        // u2.username = 'slash';
        // const m1 = new Media();
        // m1.name = 'Chaze - Think';
        // m1.dir = 'Chaze/Discography/Think 2019';
        // m1.ext = 'mp3';
        // const m2 = new Media();
        // m2.name = 'Feel Free - Mind';
        // m2.dir = 'Feel Free/Mind (2019)';
        // m2.ext = 'mp3';
        // const r1 = new SearchResponse();
        // r1.owner = u1;
        // r1.media = m1;
        // const r2 = new SearchResponse();
        // r2.owner = u2;
        // r2.media = m2;
        // this.searchResponseList.items = [r1, r2];
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

    public requestMedia(media: SearchResponse): void {
        const request = new MediaRequest();
        request.owner = media.owner.username;
        request.mediaID = media.id;
        // TODO: Fix this!!!
        // request.webRTCKey = ???

        const self = this;

        self.searchService.addMediaRequest(request)
            .then((r) => {
                self.mediaRequest = request;

                self.getMedia();
            })
            .catch((e) => console.log('Request AddMediaRequest failed: ' + e.toString()));
    }

    private getMedia(): void {
        const self = this;

        if (!self.mediaRequest) {
            self.loadingMediaResponse = false;
            return;
        }

        self.loadingMediaResponse = true;

        self.searchService.getMediaResponseList()
            .then((r) => {
                const res: MediaResponseList = r.data;
                if (r.status === 404) {
                    self.loadingMediaResponse = false;
                    return;
                }

                let done = false;
                if (res.items) {
                    for (const mr of res.items) {
                        if (mr.user.username === self.mediaRequest.user
                            && mr.owner.username === self.mediaRequest.owner
                            && mr.media.id === self.mediaRequest.mediaID) {
                            self.bag.player.play(mr);
                            self.mediaRequest = null;
                            done = true;
                            break;
                        }
                    }
                }

                if (!done) {
                    setTimeout(() => {
                        self.getMedia();
                    }, 1000);
                }
            })
            .catch((e) => {
                console.log('Request GetMediaResponsList failed: ' + e.toString());
                self.loadingMediaResponse = false;
            });
    }

    private getSearchResponseList(): void {
        const self = this;
        const request = self.searchRequest;

        if (!request || request.text === '') {
            this.loadingSearchResponse = false;
            return;
        }

        this.loadingSearchResponse = true;

        self.searchService.getSearchResponseList(request,
            self.searchRequestIndex * MAX_RESPONSE_ITEMS_PER_REQUEST_COUNT,
            MAX_RESPONSE_ITEMS_PER_REQUEST_COUNT)
            .then((r) => {
                const res: SearchResponseList = r.data;
                if (r.status === 404) {
                    self.loadingSearchResponse = false;
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
                    self.loadingSearchResponse = false;
                }
            })
            .catch((e) => {
                console.log('Request GetSearchResponseList failed: ' + e.toString());
                self.loadingSearchResponse = false;
            });
    }

    private loadMoreSearchResponseList(): void {
        const self = this;
        const request = self.searchRequest;

        if (!request || request.text === '') {
            this.loadingSearchResponse = false;
            return;
        }

        this.loadingSearchResponse = true;

        self.searchService.addSearchRequest(request.text)
            .then((r) => {
                self.searchRequestIndex = 0;

                self.getSearchResponseList();
            })
            .catch((e) => {
                console.log('Request LoadMoreSearchResponseList failed: ' + e.toString());
                self.loadingSearchResponse = false;
            });
    }

    private deepEqual(actual: any, expected: any): boolean {
        return deepEqual(actual, expected);
    }
}
