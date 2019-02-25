import {Error} from '../../core/model/error';

export class SearchRequest {
    public id: number;
    public error: Error;

    constructor(public text: string) {
    }
}
