import {Error} from '../../core/model/error';
import {User} from '../../core/model/user';

export class SearchResponse {
    public owner: User;
    public author: string;
    public title: string;
    public filename: string;
    public filepath: string;
    public error: Error;
}
