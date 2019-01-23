import {Injectable} from '@angular/core';
import {Config} from './config';
import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';

@Injectable()
export class BaseService {
    protected http: AxiosInstance;

    constructor(protected config: Config) {
        this.http = axios.create();
    }
}
