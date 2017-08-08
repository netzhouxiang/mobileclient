import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeService } from "../../../providers/NativeService";
import { HttpService } from "../../../providers/http.service";
import { MentService } from "../ment.service";
/**
 * Generated class for the UpcomingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-upcoming',
  templateUrl: 'upcoming.html',
})
export class UpcomingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public native: NativeService, private httpService: HttpService, public mentservice: MentService, ) {
  }

  ionViewDidLoad() {
    this.getpersonEvent();
  }
  upcomList = new Array();//事件列表
  getpersonEvent() {//获取人员待办事件
    var event = this.navParams.get("event");
    let requestInfo = {
      url: "mobilegrid/getpersonEvent",
      personID: this.native.UserSession._id,
      departmentID: this.mentservice.dept._id,
      type: event.typeName
    }
    this.httpService.post(requestInfo.url, requestInfo).subscribe(data => {
      try {
        let res = data.json();
        if (res.error) {
          this.native.showToast(res.error.error);
        } else {
          this.upcomList = res.success;
        }
      } catch (error) {
        this.native.showToast(error);
      }
    }, err => {
      this.native.showToast(err);
    });
  }
  goOtherPage(obj) {//去其他页面
    this.httpService.post('mobilegrid/getcurrentstep', { _id: obj._id }).subscribe(data => {
      try {
        let res = data.json();
        if (res.error) {
          this.native.showToast(res.error.error);
        } else {
          let arr = res.success[res.success.length - 1];
          this.navCtrl.push("stepPage", { "sid": arr._id, "eid": obj._id, "deptid": obj.department });
        }
      } catch (error) {
        this.native.showToast(error);
      }
    }, err => {
      this.native.showToast(err);
    });

  }
}
