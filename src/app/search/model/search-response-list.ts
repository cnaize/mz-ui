import {Error} from '../../core/model/error';
import {SearchResponse} from './search-response';

export class SearchResponseList {
    public items: SearchResponse[];
    public allItemsCount: number;
    public error: Error;
}
