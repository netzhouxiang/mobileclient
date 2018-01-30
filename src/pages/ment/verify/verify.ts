import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeService } from "../../../providers/NativeService";
import { HttpService } from "../../../providers/http.service";
import { MentService } from "../ment.service";
/**
 * Generated class for the StrokePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-verify',
  templateUrl: 'verify.html',
})
export class verifyPage {
  verifyList = [];
  rejectPage: any = 'rejectPage';
  constructor(public navCtrl: NavController, public navParams: NavParams, public native: NativeService, private httpService: HttpService, public mentservice: MentService, ) {

  }
  getverifyList() {
    var event = this.navParams.get("event");
    let requestInfo = {
      url: "event/list",
      department_id: this.native.UserSession.department_sub,
      length: 10000,
      start_index: "0",
      type_id: event._id,
      step_status: 1
    }
    this.httpService.post(requestInfo.url, requestInfo).subscribe(data => {
      try {
        let res = data.json();
        if (res.code == 200) {
          this.verifyList = res.info.list;
        } else {
          this.native.showToast(res.info);
        }
      } catch (error) {
        this.native.showToast(error);
      }
    }, err => {
      this.native.showToast(err);
    });
  }
  ionViewDidLoad() {
    this.getverifyList();
  }
  goOtherPage(obj) {//去其他页面
    this.navCtrl.push("stepPage", { "eid": obj._id, "access": "1" });
  }
}
