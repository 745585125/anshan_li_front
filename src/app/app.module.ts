import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { StartupService } from './core/startup/startup.service';
import { DefaultInterceptor } from './core/net/default.interceptor';
import { LoginComponent } from './pages/login/login.component';
import { RegisgerComponent } from './pages/regisger/regisger.component';
import { SharedModule } from './shared/shared/shared.module';
registerLocaleData(zh);
export function StartupServiceFactory(startupService: StartupService) {
  return () => startupService.load();
}
const APPINIT_PROVIDES = [
  StartupService,
  {
    provide: APP_INITIALIZER,
    useFactory: StartupServiceFactory,
    deps: [StartupService],
    multi: true,
  },
];
const INTERCEPTOR_PROVIDES = [
  { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisgerComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }, ...APPINIT_PROVIDES, ...INTERCEPTOR_PROVIDES],
  bootstrap: [AppComponent]
})
export class AppModule { }
