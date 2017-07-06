import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from "@angular/http";
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeService } from "../providers/NativeService";
import { HttpService } from "../providers/http.service";
import { ChatService } from "../providers/chat-service";
import { IonicStorageModule } from '@ionic/storage';
import { LoginService } from '../pages/login/login-service';
import { MapService } from '../pages/home/map-service';
import { Camera } from '@ionic-native/camera';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { MediaPlugin } from '@ionic-native/media';
import { MediaCapture } from '@ionic-native/media-capture';
import { Geolocation } from '@ionic-native/geolocation';
import { File } from '@ionic-native/file';
import { Device } from '@ionic-native/device';
import { Badge } from '@ionic-native/badge';
import { IonJPushModule } from 'ionic2-jpush'
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    IonJPushModule,
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: "true", // nav在push的时候隐藏
      backButtonText: '',
      iconMode: 'ios',
      mode: 'ios'
    }),
    IonicStorageModule.forRoot()
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
    ChatService,
    Camera,
    UniqueDeviceID,
    MediaPlugin,
    MediaCapture,
    Geolocation,
    File,
    MapService,
    Device,
    Badge,
    BarcodeScanner,
    { provide: ErrorHandler, useClass: IonicErrorHandler }, LoginService,
  ]
})
export class AppModule { }
