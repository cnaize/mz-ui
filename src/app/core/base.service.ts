import {Injectable} from '@angular/core';
import axios, {AxiosInstance} from 'axios';
import {environment} from '../../environments/environment';

@Injectable()
export class BaseService {
    protected http: AxiosInstance;
    protected env = environment;

    constructor() {
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

    public addToken(token: string): void {
        token = 'Bearer ' + token;
        console.log('Adding token: ' + token);
        this.http.defaults.headers.common.Authorization = token;
    }
}
