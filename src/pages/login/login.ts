import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { HttpService } from "../../providers/http.service";
import { NativeService } from "../../providers/NativeService";
import { LoginService } from './login-service';
import { Device } from '@ionic-native/device';
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    backgrounds = [
        "assets/img/login/background-1.jpg",
        "assets/img/login/background-2.jpg",
        "assets/img/login/background-3.jpg"
    ]
    constructor(public navCtrl: NavController, private platform: Platform, public device: Device, public navParams: NavParams, public modalCtrl: ModalController, public native: NativeService, public httpService: HttpService, public loginser: LoginService) {
        
    }
    doLogin() {
        this.loginser.openCamera(data => {
            this.navCtrl.push('RegistinfoPage', {
                perInfo: data
            });
        });
    }
    presentModal() {
        let modal = this.modalCtrl.create('RegisttipPage');
        modal.present();
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
        this.userStatus();
    }
    ionViewCanLeave() {
    }
    telPhone() {
        this.native.confirm('您的帐号信息正在审核中，是否联系管理员?', () => {
            location.href = "tel:23123213";
            this.telPhone();
        }, () => {
            this.platform.exitApp();
            return false;

        }, '提示', '退出', '拨打');
    }
    userStatus() {//判断
        let requert = {
            url: 'people/check',
            uuid: this.device.uuid
        }
        this.httpService.post(requert.url, requert).subscribe(data => {
            try {
                let res = data.json();
                if (res.code === 403) {//新注册
                } else if (res.code === 200) {
                    var user = res.info;
                    if (user.status == 2) {
                        this.telPhone();
                    } else if (user.status == 1) {
                        this.native.alert('已离职，无权限访问',()=>{
                            this.platform.exitApp();
                        });
                    } else {  
                    }
                }else{
                    this.native.showToast(res.code+'：服务器忙，请稍后再试');
                }
            } catch (error) {
                this.native.showToast(error);
            }
        }, err => {
            this.native.showToast(err);
        });
    }
}