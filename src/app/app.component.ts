import {Component} from '@angular/core';
import {AuthenticatedGuard} from './auth/guard/authenticated-guard';
import {UserService} from './user/user.service';
import {User} from './user/model/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public currentPage = 'search';

  constructor(public authGuard: AuthenticatedGuard, private userService: UserService) {
    // TODO: REMOVE IT!!!
    // const u = new User();
    // u.username = 'ni';
    // u.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6Im5pIn0.E04Xxz7ROycss7bo8mGQ8BHZd4_lGIbAc4H9wlXTAIY';
    // this.userService.setUser(u);
  }

  public onActivate(page: any): void {
    this.currentPage = page.name;
  }
}
