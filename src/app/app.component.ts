import {Component} from '@angular/core';
import {AuthenticatedGuard} from './auth/guard/authenticated-guard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public currentPage = 'search';

  constructor(public authGuard: AuthenticatedGuard) {
  }

  public onActivate(page: any): void {
    this.currentPage = page.name;
  }
}
