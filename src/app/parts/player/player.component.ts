import {Component, ViewChild} from '@angular/core';
import {Bag} from '../../core/bag';

@Component({
    selector: 'player',
    styleUrls: ['./player.component.scss'],
    template: `
        <div class="player" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="0.5em">
            <div>
                <div class="play-control" fxLayout="row" fxLayoutAlign="center center">
                    <mat-icon [inline]="true">{{bag.player.playing ? "pause_circle_outline" : "play_circle_outline"}}</mat-icon>
                </div>
            </div>
            <div class="full-width" fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="1em">
                <div class="media-title">{{bag.player.currentMedia?.media.name}}</div>
                <div class="media-owner">{{bag.player.currentMedia?.owner.username}}</div>
            </div>
            <mat-slider class="volume-control" #volumeBar value="50" color="primary"></mat-slider>
        </div>
    `,
})

export class PlayerComponent {

    constructor(public bag: Bag) {
    }
}
