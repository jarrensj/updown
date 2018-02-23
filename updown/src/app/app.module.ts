import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { LogoComponent } from './components/logo/logo.component';
import { HappysadComponent } from './components/happysad/happysad.component';


@NgModule({
  declarations: [
    AppComponent,
    LogoComponent,
    HappysadComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
