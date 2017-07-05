import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeService } from "../../../providers/NativeService";
import { HttpService } from "../../../providers/http.service";
/**
 * Generated class for the ReportedPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-reported',
  templateUrl: 'reported.html',
})
export class ReportedPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public native: NativeService, private httpService: HttpService) {
  }
  requestInfo = {
    url: '/personalinfo/sendpersoninfoerr',
    reason: ''
  }
  sendMsg() {
    if (!this.requestInfo.reason) {
      this.native.alert('请说明有误信息~');
      return false;
    }
    this.httpService.post(this.requestInfo.url, this.requestInfo).subscribe(data => {
      try {
        let res = data.json();
        if (res.success) {
          this.native.alert('上报成功');
        }
      } catch (error) {
        this.native.showToast(error);
      }
    }, err => {
      this.native.showToast(err);
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportedPage');
  }

}
