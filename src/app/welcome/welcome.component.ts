import {Component} from '@angular/core';
import {UserService} from '../user/user.service';
import {User} from '../user/model/user';
import {Router} from '@angular/router';

@Component({
    selector: 'welcome-component',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
})

export class WelcomeComponent {
    private user = new User();
    private signMode = 'signin';

    constructor(private router: Router, private userService: UserService) {
    }

    private send(): void {
        const self = this;

        if (self.signMode === 'signin') {
            self.userService.signIn(self.user)
                .then((r) => {
                    const res: User = r.data;
                    if (r.status !== 200) {
                        return;
                    }

                    self.userService.setUser(res);
                    self.router.navigate(['/search']);
                })
                .catch((e) => {
                    console.log('Request SignIn failed: ' + e.toString());
                });
        } else {
            self.userService.signUp(self.user)
                .then((r) => {
                    const res: User = r.data;
                    if (r.status !== 201) {
                        return;
                    }

                    self.userService.setUser(res);
                    self.router.navigate(['/search']);
                })
                .catch((e) => {
                    console.log('Request SignUp failed: ' + e.toString());
                });
        }
    }
}
