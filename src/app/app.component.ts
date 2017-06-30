import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginService } from '../pages/login/login-service';
import { NativeService } from "../providers/NativeService";
import { HttpService } from "../providers/http.service";
import { ChatService } from "../providers/chat-service";
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Storage } from '@ionic/storage';
@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = 'TabsPage';

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, loginser: LoginService, nativeService: NativeService, httpService: HttpService, chatser: ChatService, uniqueDeviceID: UniqueDeviceID, storage: Storage) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            var isRegsit = uuid => {
                loginser.getUserByUUid(uuid).subscribe(data => {
                    nativeService.UserSession = data;
                    splashScreen.hide();
                    //当地图页面加载完成，启动消息轮循 这时候用户已登录
                    chatser.getUserNoRead();
                }, err => {
                    this.rootPage = 'LoginPage';
                    splashScreen.hide();
                })
            }
            if (storage.get("uuid")) {
                isRegsit(storage.get("uuid"));
            } else {
                uniqueDeviceID.get()//获取uuid并注册
                    .then((uuid: any) => {
                        storage.set("uuid", uuid);
                        isRegsit(uuid);
                    })
                    .catch((error: any) => {
                        this.rootPage = 'LoginPage';
                        splashScreen.hide();
                    });
            }
            // c7f89e97f9194631(徐海文)  8f8f64e76a4f6238(迈克尔·辩杰克逊) 47ab9cc0fa8a8a07 tj
            // let myuuid = '47ab9cc0fa8a8a07';
            // loginser.getUserByUUid(myuuid).subscribe(data => {
            //   nativeService.UserSession = data;
            //   splashScreen.hide();
            //   //当地图页面加载完成，启动消息轮循 这时候用户已登录
            //   chatser.getUserNoRead();
            // }, err => {
            //   this.rootPage = 'RegistinfoPage';
            //   splashScreen.hide();
            // })
        });
    }
}
