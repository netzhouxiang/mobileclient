import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
import { HttpService } from "../../providers/http.service";
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
  ChatUserPage: any = 'ChatUserPage';
  toUser:Object;
  public deptlist = new Array();
  constructor(public navCtrl: NavController, public server: NativeService, public navParams: NavParams, private httpService: HttpService) {
    this.toUser = {
      toUserId:'210000198410281948',
      toUserName:'Hancock'
    }
    this.server.post("department/getAllDepartment", "").then(data => {
      this.loaduser(data);
    });
  }
  loaduser(dept) {
    //根据拿到的部门集合获取用户
    // this.server.post("department/getAllpersonsByDepartIdOneStep", "_id=" + dept[0]._id).then(data => {
    //   dept[0].userlist = data;
    //   this.deptlist.push(dept[0]);
    //   dept.splice(0, 1);
    //   if (dept.length > 0) {
    //     this.loaduser(dept);
    //   }
    // });
    let requestInfo = {
        url: "department/getAllpersonsByDepartIdOneStep",
        _id:  dept[0]._id,//票号
        hideloading:true
    }
    this.httpService.post(requestInfo.url, requestInfo).subscribe(
        data => {
            this.server.AjAxData(data, (result) => {
                dept[0].userlist = result;
                this.deptlist.push(dept[0]);
                dept.splice(0, 1);
                if (dept.length > 0) {
                  this.loaduser(dept);
                }
            });
        },
        err => console.error(err)
    );
  }
  ionViewDidLoad() {
    console.log(this.deptlist);
  }
  go(type, phone) {
    location.href = type == 0 ? "sms:" : "tel:" + phone;
  }
}
