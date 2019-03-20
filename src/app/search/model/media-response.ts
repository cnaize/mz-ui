import {User} from '../../user/model/user';
import {Media} from './media';
import {Error} from '../../core/model/error';

export class MediaResponse {
    public user: User;
    public owner: User;
    public media: Media;
    public mode: string;
    public webRTCKey: string;
    public error: Error;
}
