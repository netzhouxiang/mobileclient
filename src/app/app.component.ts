import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginService } from '../pages/login/login-service';
import { NativeService } from "../providers/NativeService";
import { HttpService } from "../providers/http.service";
import { ChatService } from "../providers/chat-service";
import { Device } from '@ionic-native/device';
import { JPushService } from 'ionic2-jpush';
import { Badge } from '@ionic-native/badge';
@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = 'TabsPage';

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, loginser: LoginService, nativeService: NativeService, httpService: HttpService, chatser: ChatService, device: Device,
        private jPushPlugin: JPushService, private badge: Badge) {
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


            //当前版本号
            let curversion = "0.0.1";
            //检测是否有更新 http://120.76.228.172/app/ver.json 
            httpService.get(nativeService.appServer.file + "app/ver.json").subscribe(data => {
                var update_m = data.json();
                if (parseInt(update_m.verInfo.replace(/\./g, "")) > parseInt(curversion.replace(/\./g, ""))) {
                    nativeService.confirm("检测到新版本，是否更新？", function () {
                        nativeService.downapk(nativeService.appServer.file + "app/" + update_m.apkName + ".apk", update_m.apkName);
                    });
                }
            });

            let myuuid = device.uuid;
            if (!myuuid) {
                myuuid = 'c7f89e97f9194631';
            }
            loginser.getUserByUUid(myuuid).subscribe(data => {
                nativeService.UserSession = data;
                nativeService.myStorage.set('UserSession', data);
                splashScreen.hide();
                //启动IM，执行查询结构，查询接受后监听消息等操作
                chatser.getUserNoRead();
            }, err => {
                this.rootPage = 'LoginPage';
                splashScreen.hide();
            });
            this.init();
            //桌面角标
            this.badge.set(11);
            //alert(this.getRegistrationID())
            //极光推送处理 全局唯一 事件参考：https://github.com/HsuanXyz/ionic2-jpush 
            //停止接受 (用户退出登录) 接受消息（需指明接受用户，防止切换用户后，推送对象错误）
            this.jPushPlugin.openNotification()
                .subscribe(res => {
                    this.badge.increase(1);
                    alert(JSON.stringify(res))
                    console.log('收到推送');
                    console.log(res)
                });
            this.jPushPlugin.receiveNotification()
                .subscribe(res => {
                    alert(JSON.stringify(res))
                    console.log('收到推送');
                    console.log(res)
                });

            this.jPushPlugin.receiveMessage()
                .subscribe(res => {
                    alert(JSON.stringify(res))
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
            .then(res => { })
            .catch(err => { })
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