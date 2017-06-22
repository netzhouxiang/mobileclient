import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';


import { HttpModule } from "@angular/http";
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeService } from "../providers/NativeService";
import { HttpService } from "../providers/http.service";
import { HttpIntercept } from "../providers/HttpIntercept";
import { HttpInterceptHandle } from "../providers/HttpInterceptHandle";

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{
      tabsHideOnSubPages:"true", // nav在push的时候隐藏
      backButtonText: '', 
      iconMode: 'ios', 
      mode: 'ios'
    }),

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeService,
    HttpService,
    HttpIntercept,
    HttpInterceptHandle,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
