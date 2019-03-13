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
        // // NOTE: REMOVE IT!!!
        // const u = new User();
        // u.username = 'cnaize';
        // const m = new Media();
        // m.name = 'Chaze - Think';
        // m.dir = '/home/music/Chaze/Discography/Think 2019';
        // m.ext = 'mp3';
        // const r = new SearchResponse();
        // r.owner = u;
        // r.media = m;
        // this.currentMedia = r;
    }

    public play(mediaResponse: MediaResponse): void {
        this.mediaResponse = mediaResponse;
        this.playing = true;
    }

    public pause(): void {
        this.playing = false;
    }
}
