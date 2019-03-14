import {User} from '../../user/model/user';

export class MediaRequest {
    public user: User;
    public owner: User;
    public mediaID: number;
    public rootID: number;
    public webRTCKey: string;
}
