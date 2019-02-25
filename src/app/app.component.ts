import {Component} from '@angular/core';
import {AuthenticatedGuard} from './auth/guard/authenticated-guard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(public authGuard: AuthenticatedGuard) {
  }
}
