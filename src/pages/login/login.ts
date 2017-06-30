import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { HttpService } from "../../providers/http.service";
import { NativeService } from "../../providers/NativeService";
import { LoginService}from './login-service';
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
    constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public native: NativeService, public httpService: HttpService,public loginser:LoginService) {
        
    }
    doLogin() {
        this.loginser.openCamera(data=>{
            this.navCtrl.push('RegistinfoPage',{
                perInfo:data
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
}