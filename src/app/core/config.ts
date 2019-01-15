import {Injectable} from '@angular/core';

@Injectable()
export class Config {
    public baseUrl: string = 'http://localhost:4200';
    public centerBaseUrl: string = 'http://localhost:11312';
}
