import { NgModule, ErrorHandler,} from '@angular/core';
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
import { MentService } from "../pages/ment/ment.service";
import { Camera } from '@ionic-native/camera';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { MediaPlugin } from '@ionic-native/media';
import { MediaCapture } from '@ionic-native/media-capture';
import { Geolocation } from '@ionic-native/geolocation';
import { File } from '@ionic-native/file';
import { Device } from '@ionic-native/device';
import { Badge } from '@ionic-native/badge';
import { IonJPushModule } from 'ionic2-jpush';
import {TabModule} from "../pages/tabs/tab.module";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Transfer } from '@ionic-native/transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { Sim } from '@ionic-native/sim';
@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    IonJPushModule,
    BrowserModule,
    HttpModule,
    TabModule,
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
    MentService,
    Camera,
    UniqueDeviceID,
    MediaPlugin,
    MediaCapture,
    Geolocation,
    File,
    MapService,
    Device,
    Sim,
    Badge,
    Transfer,
    BarcodeScanner,
    FileOpener,
    { provide: ErrorHandler, useClass: IonicErrorHandler }, LoginService,
  ]
})
export class AppModule { }
