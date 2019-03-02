import {Component} from '@angular/core';
import {AuthenticatedGuard} from './auth/guard/authenticated-guard';
import {Bag} from './core/bag';
import {UserService} from './user/user.service';
import {User} from './user/model/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public currentPage: string;

  constructor(public bag: Bag, public authGuard: AuthenticatedGuard, private userService: UserService) {
    // NOTE: REMOVE IT!!!
    const u = new User();
    u.username = 'ni';
    u.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VybmFtZSI6Im5pIn0.E04Xxz7ROycss7bo8mGQ8BHZd4_lGIbAc4H9wlXTAIY';
    this.userService.setUser(u);
  }

  public onActivate(page: any): void {
    this.currentPage = page.constructor.name;
  }
}
