import {Component} from '@angular/core';
import {AuthenticatedGuard} from './auth/guard/authenticated-guard';
import {UserService} from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public currentPage = 'SearchComponent';

  constructor(public authGuard: AuthenticatedGuard, private userService: UserService) {
  }

  public onActivate(page: any): void {
    this.currentPage = page.name;
  }
}
