import {SearchResponse} from './search-response';
import {Error} from '../../core/model/error';
import {SearchRequest} from './search-request';

export class SearchResponseList {
    public request: SearchRequest;
    public items: SearchResponse[];
    public error: Error;
}
