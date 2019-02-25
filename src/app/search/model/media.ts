import {Error} from '../../core/model/error';

export class Media {
    public id: number;
    public name: string;
    public ext: string;
    public dir: string;
    public error: Error;
}
