import {Error} from '../../core/model/error';

export class SearchRequest {
    public text: string;
    public totalRespCount: number;
    public error: Error;
}
