import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginService}from '../pages/login/login-service';
import { NativeService } from "../providers/NativeService";
import { HttpService } from "../providers/http.service";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'TabsPage';

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,loginser:LoginService,nativeService:NativeService,httpService: HttpService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
     
// c7f89e97f9194631(徐海文)  8f8f64e76a4f6238(迈克尔·辩杰克逊)
      let uuid='c7f89e97f9194631';
      loginser.getUserByUUid(uuid).subscribe(data=>{
            nativeService.UserSession = data;
            splashScreen.hide();
      },err=>{
           this.rootPage='LoginPage';
           splashScreen.hide();
      })
      
    });
  }
}
