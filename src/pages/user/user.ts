import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
/**
 * Generated class for the UserPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  userInfo:any;
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams,private native:NativeService,) {
    this.userInfo=this.native.UserSession;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
  }
  goOtherPage(pagename,data={}){//去目标页面
    this.navCtrl.push(pagename,data);
  }
  scanLogin(){
            let modal = this.modalCtrl.create('ScanloginPage');
        modal.present();
  }
}
