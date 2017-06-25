import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { HttpService } from "../../providers/http.service";
import { NativeService } from "../../providers/NativeService";
import { ChatService } from "../../providers/chat-service";
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
    constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public native: NativeService, public httpService: HttpService, public chatser: ChatService) {
        //测试数据 默认查询当前用户信息 标记登录  后面再处理 c7f89e97f9194631(徐海文)  8f8f64e76a4f6238(迈克尔·辩杰克逊)
        this.httpService.post("person/getPersonByUUId", { mobileUUid: "c7f89e97f9194631" }).subscribe(data => {
            console.log(data.json());
            this.native.UserSession = data.json();
            //当地图页面加载完成，启动消息轮循 这时候用户已登录
            this.chatser.getUserNoRead();
        });
        //测试手工调用插件 cordova-plugin-media  播放音频
        if (Media) {
            var xxx = new Media('http://120.76.228.172/voices/8855.wav')
            console.log(Media)
            xxx.play();
        }
    }
    doLogin() {
        this.navCtrl.setPages([{ page: 'RegistinfoPage' }]);

    }
    presentModal() {
        let modal = this.modalCtrl.create('RegisttipPage');
        modal.present();
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

}