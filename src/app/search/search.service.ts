import {BaseService} from '../core/base.service';
import {Injectable} from '@angular/core';
import {AxiosPromise} from 'axios';
import {SearchRequest} from './model/search-request';
import {SearchResponseList} from './model/search-response-list';

@Injectable()
export class SearchService extends BaseService {
    public addSearchRequest(text: string): AxiosPromise<SearchRequest> {
        return this.http.post(this.config.centerBaseUrl + '/v1/searches/requests?text=' + text);
    }

    public getSearchResponseList(request: SearchRequest, offset: number, count: number): AxiosPromise<SearchResponseList> {
        return this.http.get(this.config.centerBaseUrl + '/v1/searches/responses?text=' + request.text +
            '&offset=' + offset + '&count=' + count);
    }
}

function goQueryEscape(str: string) {
    return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, '%2A');
}
