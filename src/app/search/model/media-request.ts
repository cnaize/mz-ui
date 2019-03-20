import {User} from '../../user/model/user';
import {Media} from './media';

export class MediaRequest {
    public user: User;
    public owner: User;
    public media: Media;
    public mode: string;
    public webRTCKey: string;
}
