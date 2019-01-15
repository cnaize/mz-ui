import {BaseService} from '../core/base.service';
import {Injectable} from '@angular/core';

@Injectable()
export class SearchService extends BaseService {
    public getSearches(): void {
        this.http.get('/v1/searches').then((r) => console.log('HERE: ' + JSON.stringify(r.data)));
    }
}
