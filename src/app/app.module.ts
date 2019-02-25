import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule, MatSidenavModule,
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SearchComponent} from './search/search.component';
import {SearchModule} from './search/search.module';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {UserModule} from './user/user.module';
import {UserComponent} from './user/user.component';
import {AuthenticatedGuard} from './auth/guard/authenticated-guard';
import {WelcomeModule} from './welcome/welcome.module';
import {WelcomeComponent} from './welcome/welcome.component';

@NgModule({
  declarations: [
      AppComponent,
      WelcomeComponent,
      UserComponent,
      SearchComponent,
  ],
  imports: [
      BrowserModule,
      FlexLayoutModule,
      BrowserAnimationsModule,
      FormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      MatButtonModule,
      MatCardModule,
      MatListModule,
      MatProgressSpinnerModule,
      MatSidenavModule,
      WelcomeModule,
      UserModule,
      SearchModule,
      RouterModule.forRoot([
          {
              path: '',
              redirectTo: '/welcome',
              pathMatch: 'full',
          },
          {
              path: 'welcome',
              component: WelcomeComponent,
          },
          {
              path: 'user',
              canActivate: [AuthenticatedGuard],
              component: UserComponent,
          },
          {
              path: 'search',
              canActivate: [AuthenticatedGuard],
              component: SearchComponent,
          },
      ]),
  ],
  providers: [
      AuthenticatedGuard,
  ],
  bootstrap: [AppComponent],
})

export class AppModule { }
