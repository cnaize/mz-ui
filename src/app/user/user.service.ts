import {Injectable} from '@angular/core';
import {BaseService} from '../core/base.service';
import {AxiosPromise} from 'axios';
import {User} from './model/user';

@Injectable()
export class UserService extends BaseService {
    public user: User;

    public signIn(user: User): AxiosPromise<User> {
        return this.http.post(this.env.centerBaseUrl + '/v1/users/signin', JSON.stringify(user));
    }

    public signUp(user: User): AxiosPromise<User> {
        return this.http.post(this.env.centerBaseUrl + '/v1/users/signup', JSON.stringify(user));
    }

    public sendUserToCore(user: User): void {
        this.http.post(this.env.coreBaseUrl + '/v1/users/set', JSON.stringify(user))
            .then((r) => {
                if (r.status === 202) {
                    console.log('User "' + user.username + '" sent to core successfully');
                    return;
                }

                console.log('User "' + user.username + '" sent to core failed');
            })
            .catch((e) => console.log('User "' + user.username + '" sent to core failed: ' + e.toString()));
    }

    public setUser(user: User): void {
        console.log('Setting current user: ' + user.username);
        this.addToken(user.token);
        this.user = user;
        this.sendUserToCore(user);
    }
}
