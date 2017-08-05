import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { HttpService } from "../../providers/http.service";
import { NativeService } from "../../providers/NativeService";
import { LoginService } from './login-service';
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
    constructor(public navCtrl: NavController, private platform: Platform, public navParams: NavParams, public modalCtrl: ModalController, public native: NativeService, public httpService: HttpService, public loginser: LoginService) {

    }
    islogin: boolean;
    doLogin() {
        this.loginser.openCamera(data => {
            this.islogin = true;
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
    }
    ionViewCanLeave() {
        if (!this.islogin) {
            this.native.confirm('是否要确定退出应用？', () => {
                this.platform.exitApp();
            }, () => {
            }, '提示', '取消', '退出');
            return false;
        }

    }
}