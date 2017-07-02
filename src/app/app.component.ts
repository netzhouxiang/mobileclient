import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginService } from '../pages/login/login-service';
import { NativeService } from "../providers/NativeService";
import { HttpService } from "../providers/http.service";
import { ChatService } from "../providers/chat-service";
import { Device } from '@ionic-native/device';
import { JPushService } from 'ionic2-jpush'
@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = 'TabsPage';

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, loginser: LoginService, nativeService: NativeService, httpService: HttpService, chatser: ChatService, device: Device,
        private jPushPlugin: JPushService) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            // loginser.getUserByUUid(device.uuid).subscribe(data => {//判断用户是否注册
            //     nativeService.UserSession = data;
            //     splashScreen.hide();
            //     //当地图页面加载完成，启动消息轮循 这时候用户已登录
            //     chatser.getUserNoRead();
            // }, err => {
            //     this.rootPage = 'LoginPage';
            //     splashScreen.hide();
            // })
            //c7f89e97f9194631(徐海文)  8f8f64e76a4f6238(迈克尔·辩杰克逊) 47ab9cc0fa8a8a07 tj
            let myuuid = '47ab9cc0fa8a8a07';
            loginser.getUserByUUid(myuuid).subscribe(data => {
                nativeService.UserSession = data;
                splashScreen.hide();
                //当地图页面加载完成，启动消息轮循 这时候用户已登录
                chatser.getUserNoRead();
            }, err => {
                this.rootPage = 'LoginPage';
                splashScreen.hide();
            });
            //极光推送处理 全局唯一 事件参考：https://github.com/HsuanXyz/ionic2-jpush
            this.jPushPlugin.openNotification()
                .subscribe(res => {
                    console.log('收到推送');
                    console.log(res)
                });
            this.jPushPlugin.receiveNotification()
                .subscribe(res => {
                    console.log('收到推送');
                    console.log(res)
                });

            this.jPushPlugin.receiveMessage()
                .subscribe(res => {
                    console.log('收到推送');
                    console.log(res)
                });
        });
    }
    /**
    * 注册极光
    */
    init() {
        this.jPushPlugin.init()
            .then(res => alert(res))
            .catch(err => alert(err))
    }
    /**
    * 获取ID
    */
    getRegistrationID() {
        this.jPushPlugin.getRegistrationID()
            .then(res => alert(res))
            .catch(err => alert(err))
    }
}
