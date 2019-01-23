import {BaseService} from '../core/base.service';
import {Injectable} from '@angular/core';
import {AxiosPromise} from 'axios';
import {SearchRequest} from './model/search-request';
import {SearchResponseList} from './model/search-response-list';
import {Base64} from '../core/base64';

@Injectable()
export class SearchService extends BaseService {
    public addSearchRequest(text: string): AxiosPromise<SearchRequest> {
        text = Base64.Encode(text.trim().toLowerCase());
        return this.http.post(this.config.centerBaseUrl + '/v1/searches/requests/' + text);
    }

    public getSearchResponseList(text: string): AxiosPromise<SearchResponseList> {
        return this.http.get(this.config.centerBaseUrl + '/v1/searches/responses/' + text);
    }
}

function goQueryEscape(str: string) {
    return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, '%2A');
}
