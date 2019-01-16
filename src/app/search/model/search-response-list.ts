import {SearchResponse} from './search-response';
import {Error} from '../../core/model/error';

export class SearchResponseList {
    public items: SearchResponse[];
    public error: Error;
}
