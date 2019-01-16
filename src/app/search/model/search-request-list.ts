import {SearchRequest} from './search-request';
import {Error} from '../../core/model/error';

export class SearchRequestList {
    public items: SearchRequest[];
    public totalReqCount: number;
    public error: Error;
}
