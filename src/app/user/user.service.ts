import {Injectable} from '@angular/core';
import {BaseService} from '../core/base.service';
import {AxiosPromise} from 'axios';
import {User} from './model/user';

@Injectable()
export class UserService extends BaseService {
    public user: User;

    public signIn(user: User): AxiosPromise<User> {
        return this.http.post(this.config.centerBaseUrl + '/v1/users/signin', JSON.stringify(user));
    }

    public signUp(user: User): AxiosPromise<User> {
        return this.http.post(this.config.centerBaseUrl + '/v1/users/signup', JSON.stringify(user));
    }

    public setUser(user: User): void {
        console.log('Setting current user: ' + user.username);
        this.addToken(user.token);
        this.user = user;
    }
}
