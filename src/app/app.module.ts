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
    MatProgressSpinnerModule,
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SearchComponent} from './search/search.component';
import {SearchModule} from './search/search.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
      AppComponent,
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
      SearchModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
})

export class AppModule { }
