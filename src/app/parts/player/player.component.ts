import {Component} from '@angular/core';
import {Player} from '../../core/player/player';

@Component({
    selector: 'player',
    styleUrls: ['./player.component.scss'],
    template: `
        <div class="player" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="0.5em">
            <div>
                <div class="play-control" fxLayout="row" fxLayoutAlign="center center">
                    <mat-icon [inline]="true">{{player.isWaitingForResponse() ? "hourglass_empty" :
                            (player.isPlaying() ? "pause_circle_outline" : "play_circle_outline")}}</mat-icon>
                </div>
            </div>
            <div class="full-width" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="1em">
                <div class="media-title">{{player.mediaRequest ? player.mediaRequest.media.name : "Nothing to play"}}</div>
                <div class="media-owner">{{player.mediaRequest ? player.mediaRequest.owner.username : ""}}</div>
            </div>
            <mat-slider class="volume-control" #volumeBar value="50" color="primary"></mat-slider>
        </div>
    `,
})

export class PlayerComponent {

    constructor(public player: Player) {
    }
}
