import {Error} from '../../core/model/error';
import {MediaRequest} from './media-request';

export class MediaResponse {
    public request: MediaRequest;
    public webRTCKey: string;
    public error: Error;
}
