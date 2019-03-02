import {Injectable} from '@angular/core';
import {Player} from './player/player';

@Injectable()
export class Bag {
    constructor(public player: Player) {
    }
}
