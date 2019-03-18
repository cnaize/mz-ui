import {Component} from '@angular/core';
import {SearchService} from './search.service';
import {SearchRequest} from './model/search-request';
import {SearchResponseList} from './model/search-response-list';
import deepEqual = require('deep-equal'); // tslint:disable-line
import {Base64} from '../core/base64';
import {SearchResponse} from './model/search-response';
import {Page} from '../core/page';
import {MediaRequest} from './model/media-request';
import {MediaResponseList} from './model/media-response-list';
import {User} from '../user/model/user';
import {UserService} from '../user/user.service';
import {PeerConnection} from '../core/model/peer-connection';
import {Player} from '../core/player/player';

const MAX_RESPONSE_ITEMS_PER_REQUEST_COUNT: number = 20;
const MEDIA_RESPONSES_TIMEOUT: number = 10;

@Component({
    selector: 'search-component',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent extends Page {
    public searchRequest: SearchRequest;
    public searchResponseList: SearchResponseList;
    public mediaRequest: MediaRequest;
    public loadingSearchResponse: boolean;

    private searchRequestIndex: number;

    constructor(private player: Player, private searchService: SearchService, private userService: UserService) {
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
                self.searchRequest = new SearchRequest(text);
                self.searchRequestIndex = 0;
                self.searchResponseList.items = [];

                self.getSearchResponseList();
            })
            .catch((e) => console.log('Request AddSearchRequest failed: ' + e.toString()));
    }

    public addMediaRequest(response: SearchResponse): void {
        const peer = this.createPeerConnection();

        let tryN = 0;
        const sendMediaRequest = (() => {
            if (tryN > 5) {
                console.log('AddMediaRequest: peer local description timeout');
                peer.connection.close();
                return;
            }

            if (peer.error) {
                console.log('AddMediaRequest: peer connection error: ' + peer.error);
                peer.connection.close();
                return;
            }

            if (peer.webRTCKey) {
                const owner = new User();
                owner.username = this.userService.user.username;

                const request = new MediaRequest();
                request.owner = owner;
                request.media = response.media;
                request.webRTCKey = peer.webRTCKey;

                const self = this;

                self.player.setMediaRequest(peer, request);

                self.searchService.addMediaRequest(request)
                    .then((r) => {
                        if (r.status !== 201) {
                            return;
                        }

                        self.mediaRequest = request;

                        self.getMediaResponses();
                    })
                    .catch((e) => console.log('Request AddMediaRequest failed: ' + e.toString()));
            } else {
                tryN++;
                setTimeout(() => {
                    sendMediaRequest();
                }, 200);
            }
        });

        sendMediaRequest();
    }

    private getMediaResponses(): void {
        const self = this;

        if (!self.mediaRequest) {
            self.mediaRequest = null;
            return;
        }

        self.searchService.getMediaResponseList()
            .then((r) => {
                let done = false;

                if (r.status === 404) {
                    this.mediaRequest = null;
                    this.player.dropRequest();
                    return;
                }

                const res: MediaResponseList = r.data;
                if (r.status === 200 && res.items) {
                    for (const mr of res.items) {
                        if (!mr.error
                            && mr.user.username === self.mediaRequest.user.username
                            && mr.owner.username === self.mediaRequest.owner.username
                            && mr.media.coreSideID === self.mediaRequest.media.coreSideID
                            && mr.media.rootID === self.mediaRequest.media.rootID) {
                            if (self.player.setMediaResponse(mr)) {
                                self.player.play();
                            }

                            self.mediaRequest = null;
                            done = true;
                            break;
                        }
                    }
                }

                if (!done) {
                    setTimeout(() => {
                        self.getMediaResponses();
                    }, 1000);
                }
            })
            .catch((e) => {
                console.log('Request GetMediaResponseList failed: ' + e.toString());
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

    private createPeerConnection(): PeerConnection {
        const pc = new RTCPeerConnection({
            iceServers: [
                {urls: 'stun:stun.l.google.com:19302'},
                {urls: 'stun:stun1.l.google.com:19302'},
                {urls: 'stun:stun2.l.google.com:19302'},
                {urls: 'stun:stun3.l.google.com:19302'},
                {urls: 'stun:stun4.l.google.com:19302'},
            ],
        });

        const peer = new PeerConnection();
        peer.connection = pc;

        pc.onicecandidate = ((event) => {
            if (event.candidate === null) {
                peer.webRTCKey = Base64.Encode(JSON.stringify(pc.localDescription));
            }
        });

        pc.createOffer({offerToReceiveAudio: true})
            .then((d) => {
                pc.setLocalDescription(d);
            })
            .catch((e) => {
                peer.error = 'Peer connection: offer creation failed: ' + e.toString();
                console.log(peer.error);
            });

        return peer;
    }

    private deepEqual(actual: any, expected: any): boolean {
        return deepEqual(actual, expected);
    }
}
