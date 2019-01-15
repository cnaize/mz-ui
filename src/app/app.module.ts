import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SearchComponent} from './search/search.component';
import {SearchModule} from './search/search.module';

@NgModule({
  declarations: [
      AppComponent,
      SearchComponent,
  ],
  imports: [
      BrowserModule,
      FlexLayoutModule,
      BrowserAnimationsModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      MatButtonModule,
      SearchModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
})

export class AppModule { }
