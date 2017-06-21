import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";

/**
 * Generated class for the ChatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  public deptlist = new Array();
  index = 0;
  constructor(public navCtrl: NavController, public server: NativeService, public navParams: NavParams) {
    this.server.post("department/getAllDepartment", "").then(data => {
      this.loaduser(data);
    });
  }
  loaduser(dept) {
    //根据拿到的部门集合获取用户
    this.server.post("department/getAllpersonsByDepartIdOneStep", "_id=" + dept[0]._id).then(data => {
      dept[0].userlist = data;
      this.deptlist.push(dept[0]);
      dept.splice(0, 1);
      if (dept.length > 0) {
        this.loaduser(dept);
      }
    });
  }
  ionViewDidLoad() {
    console.log(this.deptlist);
  }
  go(type, phone) {
    location.href = type == 0 ? "sms:" : "tel:" + phone;
  }
}
