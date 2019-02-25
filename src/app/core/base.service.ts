import {Injectable} from '@angular/core';
import {Config} from './config';
import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';

@Injectable()
export class BaseService {
    protected http: AxiosInstance;

    constructor(protected config: Config) {
        const validStatusFn = (status: number) => {
            if ((status >= 200 && status < 300) ||
                (status === 400) ||
                (status === 404) ||
                (status === 409)) {
                return true;
            }
            return false;
        };
        this.http = axios.create({validateStatus: validStatusFn});
    }
}
