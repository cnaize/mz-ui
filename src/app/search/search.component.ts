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
import {User} from '../user/model/user';
import {UserService} from '../user/user.service';

const MAX_RESPONSE_ITEMS_PER_REQUEST_COUNT: number = 20;
const MEDIA_RESPONSES_TIMEOUT: number = 10;

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
    private mediaResponsesTime: number;

    constructor(public bag: Bag, private searchService: SearchService, private userService: UserService) {
        super('search');

        this.searchResponseList = new SearchResponseList();
        this.searchResponseList.items = [];
    }

    public addSearchRequest(text: string): void {
        if (text === '') {
            return;
        }

        const self = this;
        text = Base64.Encode(text.trim().toLowerCase());

        self.searchService.addSearchRequest(text)
            .then((r) => {
                if (r.status !== 201) {
                    return;
                }

                self.searchRequest = new SearchRequest(text);
                self.searchRequestIndex = 0;
                self.searchResponseList.items = [];

                self.getSearchResponseList();
            })
            .catch((e) => console.log('Request AddSearchRequest failed: ' + e.toString()));
    }

    public addMediaRequest(response: SearchResponse): void {
        const owner = new User();
        owner.username = this.userService.user.username;

        const request = new MediaRequest();
        request.owner = owner;
        request.mediaID = response.media.id;
        request.rootID = response.media.rootID;
        request.webRTCKey = 'FIX ME'; // TODO: Fix this!!!

        const self = this;

        self.searchService.addMediaRequest(request)
            .then((r) => {
                if (r.status !== 201) {
                    return;
                }

                self.mediaRequest = request;
                self.mediaResponsesTime = 0;

                self.getMediaResponses();
            })
            .catch((e) => console.log('Request AddMediaRequest failed: ' + e.toString()));
    }

    private getMediaResponses(): void {
        const self = this;

        if (!self.mediaRequest || self.mediaResponsesTime > MEDIA_RESPONSES_TIMEOUT) {
            self.loadingMediaResponse = false;
            self.mediaResponsesTime = 0;
            self.mediaRequest = null;
            return;
        }

        self.loadingMediaResponse = true;

        self.searchService.getMediaResponseList()
            .then((r) => {
                let done = false;

                const res: MediaResponseList = r.data;
                if (r.status === 200 && res.items) {
                    for (const mr of res.items) {
                        if (!mr.error
                            && mr.user.username === self.mediaRequest.user.username
                            && mr.owner.username === self.mediaRequest.owner.username
                            && mr.media.id === self.mediaRequest.mediaID
                            && mr.media.rootID === self.mediaRequest.rootID) {
                            self.bag.player.play(mr);
                            self.mediaRequest = null;
                            self.loadingMediaResponse = false;
                            self.mediaResponsesTime = 0;
                            done = true;
                            break;
                        }
                    }
                }

                if (!done) {
                    setTimeout(() => {
                        self.mediaResponsesTime++;
                        self.getMediaResponses();
                    }, 1000);
                }
            })
            .catch((e) => {
                console.log('Request GetMediaResponseList failed: ' + e.toString());
                self.loadingMediaResponse = false;
                self.mediaResponsesTime = 0;
                self.mediaRequest = null;
            });
    }

    private getSearchResponseList(): void {
        const self = this;
        const request = self.searchRequest;

        if (!request || request.text === '') {
            self.loadingSearchResponse = false;
            return;
        }

        self.loadingSearchResponse = true;

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
            self.loadingSearchResponse = false;
            return;
        }

        self.loadingSearchResponse = true;

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
