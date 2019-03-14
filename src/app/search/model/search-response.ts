import {Media} from './media';
import {User} from '../../user/model/user';

export class SearchResponse {
    public id: number;
    public owner: User;
    public media: Media;
}
