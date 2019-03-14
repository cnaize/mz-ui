import {Injectable} from '@angular/core';
import {SearchResponse} from '../../search/model/search-response';
import {MediaResponse} from '../../search/model/media-response';

@Injectable()
export class Player {
    public mediaResponse: MediaResponse;
    public audio: HTMLAudioElement = document.createElement('audio');

    // NOTE: replace it
    public playing: boolean;

    constructor() {
    }

    public play(mediaResponse: MediaResponse): void {
        this.mediaResponse = mediaResponse;
        this.playing = true;
    }

    public pause(): void {
        this.playing = false;
    }

    public isCurrentMediaEquals(searchResponse: SearchResponse): boolean {
        return this.mediaResponse
            && searchResponse
            && this.mediaResponse.owner.username === searchResponse.owner.username
            && this.mediaResponse.media.id === searchResponse.media.id
            && this.mediaResponse.media.rootID === searchResponse.media.rootID;
    }
}
