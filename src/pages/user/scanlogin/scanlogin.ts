import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { NativeService } from "../../../providers/NativeService";
import { HttpService } from "../../../providers/http.service";
/**
 * Generated class for the ScanloginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-scanlogin',
  templateUrl: 'scanlogin.html',
})
export class ScanloginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public native: NativeService, private httpService: HttpService) {
    this.requestInfo.uuid=navParams.get('text');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanloginPage');
  }
  requestInfo = {
    url: '/personalinfo/sendphoneBypclogin',
    uuid:'',
    personID:this.native.UserSession&&this.native.UserSession._id,
  }
  pcLogin() {//登录
    this.httpService.post(this.requestInfo.url, this.requestInfo).subscribe(data => {
      try {
        let res = data.json();
        if (res.error) {
          this.native.showToast('登录授权失败');
        } else {
        }
      } catch (error) {
        this.native.showToast(error);
      }
      this.dismiss();
    }, err => {
      this.native.showToast(err);
    });
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
