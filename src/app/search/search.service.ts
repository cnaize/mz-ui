import {BaseService} from '../core/base.service';
import {Injectable} from '@angular/core';
import {SearchRequestList} from './model/search-request-list';
import {AxiosPromise} from 'axios';
import {SearchRequest} from './model/search-request';
import {SearchResponseList} from './model/search-response-list';

@Injectable()
export class SearchService extends BaseService {
    public getSearchRequestList(): AxiosPromise<SearchRequestList> {
        return this.http.get('/v1/searches');
    }

    public addSearchRequest(text: string): AxiosPromise<SearchRequest> {
        return this.http.post<SearchRequest>('/v1/searches/' + encodeURIComponent(text));
    }

    public getSearchResponseList(text: string): AxiosPromise<SearchResponseList> {
        return this.http.get('/v1/searches/' + encodeURIComponent(text));
    }
}
