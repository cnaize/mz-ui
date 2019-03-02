import {Injectable} from '@angular/core';
import {SearchResponse} from '../../search/model/search-response';
import {User} from '../../user/model/user';
import {Media} from '../../search/model/media';

@Injectable()
export class Player {
    public currentMedia: SearchResponse;
    public audio: HTMLAudioElement = document.createElement('audio');

    // NOTE: replace it
    public playing: boolean;

    constructor() {
    }

    public requestMedia(media: SearchResponse): void {
        this.currentMedia = media;
        this.play();
    }

    public play(): void {
        this.playing = true;
    }

    public pause(): void {
        this.playing = false;
    }
}
