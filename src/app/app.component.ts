import { Component, ViewChild } from '@angular/core';
import { Platform, Keyboard, IonicApp, Nav, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginService } from '../pages/login/login-service';
import { NativeService } from "../providers/NativeService";
import { HttpService } from "../providers/http.service";
import { ChatService } from "../providers/chat-service";
import { Device } from '@ionic-native/device';
import { JPushService } from 'ionic2-jpush';
import { Badge } from '@ionic-native/badge';
import { AppMinimize } from '@ionic-native/app-minimize';
declare let window: any;
@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild('myNav') nav: Nav;
    rootPage: any = 'TabsPage';
    backButtonPressed: boolean = false;
    constructor(private platform: Platform,
        private keyboard: Keyboard,
        public modalCtrl: ModalController,
        private ionicApp: IonicApp, statusBar: StatusBar, public splashScreen: SplashScreen, loginser: LoginService, private nativeService: NativeService, public httpService: HttpService, chatser: ChatService, device: Device,
        private jPushPlugin: JPushService, private badge: Badge, private appMinimize: AppMinimize) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            // loginser.getUserByUUid(device.uuid).subscribe(data => {//判断用户是否注册
            //     nativeService.UserSession = data;
            //     this.closeSplashScreen();
            //     //当地图页面加载完成，启动消息轮循 这时候用户已登录
            //     chatser.getUserNoRead();
            // }, err => {
            //     this.rootPage = 'LoginPage';
            //     this.closeSplashScreen();
            // })
            //c7f89e97f9194631(徐海文)  8f8f64e76a4f6238(迈克尔·辩杰克逊) 47ab9cc0fa8a8a07 tj
            //初始化im
            if (window.plugins) {
                window.plugins.JMessagePlugin.init({ isOpenMessageRoaming: true })
            }
            //当前版本号
            let curversion = "0.5.0";
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
                myuuid = '1234561';
            }
            myuuid = '1234561';
            loginser.getUserByUUid(myuuid).subscribe(data => {
                console.log(data);
                nativeService.UserSession = data;
                //设置极光id
                this.getRegistrationID();
                nativeService.myStorage.set('UserSession', data);
                //启动IM，执行查询结构，查询接受后监听消息等操作
                //chatser.getUserNoRead();
                //获取部门集合和用户集合 进行缓存
                this.httpService.post('department/list', { hideloading: true }).subscribe(data => {
                    try {
                        if (data.json().code == 200) {
                            this.nativeService.DeptList = data.json().info;
                        }
                    } catch (error) {
                        this.nativeService.showToast('获取部门信息失败');
                    }
                }, err => { this.nativeService.showToast('获取部门信息失败'); });
                this.httpService.post('people/list', { start_index: "0", length: 10000, hideloading: true }).subscribe(data => {
                    try {
                        if (data.json().code == 200) {
                            this.nativeService.UserList = data.json().info;
                        }
                    } catch (error) {
                        this.nativeService.showToast('获取用户信息失败');
                    }
                }, err => { this.nativeService.showToast('获取用户信息失败'); });
                //im登陆
                if (window.plugins) {
                    window.plugins.JMessagePlugin.login({ username: 'yzwg_' + nativeService.UserSession._id, password: nativeService.UserSession.pwd }, () => { }, (error) => { });
                    chatser.receiveMessage();
                }
                this.closeSplashScreen();
            }, err => {
                this.nav.push('LoginPage');
                this.closeSplashScreen();
            });
            this.init();
            //桌面角标
            this.badge.set(1);
            //alert(this.getRegistrationID())
            //极光推送处理 全局唯一 事件参考：https://github.com/HsuanXyz/ionic2-jpush 
            //停止接受 (用户退出登录) 接受消息（需指明接受用户，防止切换用户后，推送对象错误）
            this.jPushPlugin.openNotification()
                .subscribe(res => {
                    this.badge.increase(-1);
                });
            this.jPushPlugin.receiveNotification()
                .subscribe(res => {
                    this.badge.increase(1);
                });
            this.jPushPlugin.receiveMessage()
                .subscribe(res => {

                });
        });
        this.registerBackButtonAction()//注册返回事件
    }
    /**
    * 延迟关闭
    */
    closeSplashScreen() {
        this.splashScreen.hide();
        // setTimeout(() => {
        //     this.splashScreen.hide();
        // }, 2 * 1000);
    }
    /**
    * 注册极光
    */
    init() {
        if (this.jPushPlugin) {
            this.jPushPlugin.init()
                .then(res => { })
                .catch(err => { })
        }
    }
    /**
    * 获取ID
    */
    getRegistrationID() {
        //修改极光ID已切换新接口
        if (this.jPushPlugin) {
            this.jPushPlugin.getRegistrationID()
                .then(res => {
                    this.httpService.post("people/update", { _id: this.nativeService.UserSession._id, jiguang_id: res }).subscribe(data => { console.log(200) });
                })
                .catch(err => { })
        }

    }
    registerBackButtonAction() {//注册返回事件
        if (!this.nativeService.isAndroid()) {
            return;
        }
        try {
            this.platform.registerBackButtonAction(() => {
                try {

                    if (this.keyboard.isOpen()) {//如果键盘开启则隐藏键盘
                        this.keyboard.close();
                        return;
                    }
                    //如果想点击返回按钮隐藏toast或loading或Overlay就把下面加上
                    // this.ionicApp._toastPortal.getActive() ||this.ionicApp._loadingPortal.getActive()|| this.ionicApp._overlayPortal.getActive()
                    let activePortal = this.ionicApp._modalPortal.getActive();
                    if (activePortal) {
                        activePortal.dismiss();
                        return;
                    }

                    let activeVC = this.nav.getActive();
                    let tabs = activeVC.instance.tabs;
                    if (tabs) {
                        let activeNav = tabs.getSelected();
                        return activeNav.canGoBack() ? activeNav.pop() : this.appMinimize.minimize()//this.showExit()
                    } else {
                        return this.appMinimize.minimize()//this.showExit();
                    }

                } catch (error) {
                    alert(error);
                }
            }, 1);
        } catch (error) {
        }
    }

    //双击退出提示框
    showExit() {
        if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
            this.platform.exitApp();
        } else {
            this.nativeService.showToast('再按一次退出应用');
            this.backButtonPressed = true;
            setTimeout(() => { //2秒内没有再次点击返回则将触发标志标记为false
                this.backButtonPressed = false;
            }, 2000)
        }
    }
}