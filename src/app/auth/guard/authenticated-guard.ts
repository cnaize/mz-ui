import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {User} from '../../user/model/user';
import {UserService} from '../../user/user.service';

@Injectable()
export class AuthenticatedGuard {

    constructor(protected router: Router, protected userService: UserService) {
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>
        | Promise<boolean>
        | boolean {

        const self = this;

        return new Promise<boolean>((resolve, reject) => {
            if (self.isAllowed(self.userService.user)) {
                resolve(true);
            } else {
                resolve(false);

                self.router.navigate(['/welcome']);
            }
        });
    }

    public isAuthenticated(): boolean {
        return this.isAllowed(this.userService.user);
    }

    protected isAllowed(user: User): boolean {
        return !!(user && user.token);
    }
}
