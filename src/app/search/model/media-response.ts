import {User} from '../../user/model/user';
import {Media} from './media';

export class MediaResponse {
    public user: User;
    public owner: User;
    public media: Media;
    public webRTCKey: string;
}
