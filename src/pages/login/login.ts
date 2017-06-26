import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { HttpService } from "../../providers/http.service";
import { NativeService } from "../../providers/NativeService";
import { ChatService } from "../../providers/chat-service";
import { LoginService}from './login-service';
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare let Media: any;

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
    constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public native: NativeService, public httpService: HttpService, public chatser: ChatService,public loginser:LoginService) {
        //测试手工调用插件 cordova-plugin-media  播放音频
        if (typeof (Media) != "undefined") {
            var xxx = new Media('http://120.76.228.172/voices/8855.wav')
            console.log(Media)
            xxx.play();
        }
    }
    doLogin() {
        this.loginser.openCamera('');
        // this.openCamera('camera-thmb',()=>{
        //         this.navCtrl.push('RegistinfoPage');
        // })
        
    }
    presentModal() {
        let modal = this.modalCtrl.create('RegisttipPage');
        modal.present();
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }
}