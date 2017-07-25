import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MentService } from "../ment.service";
/**
 * Generated class for the StrokePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-casereport',
  templateUrl: 'casereport.html',
})
export class CaseReportPage {
  eventlist = [];
  ajaxdata = {
    name: "",
    type: "",
    departmentID: "",
    position: [],
    newwho: ""
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, public mentservice: MentService) {
    this.ajaxdata.newwho = this.mentservice.chatser.native.UserSession._id;
    this.ajaxdata.position = this.mentservice.location.loc;
    mentservice.getAllAbstracttype().subscribe(data => {
      this.eventlist = data.json().success;
    });
  }
  //下一步，提交参数
  nextclick() {
    this.navCtrl.push("stepPage", { "sid": "59779b95a30e39e8138d34f2" });
    
    // if (!this.ajaxdata.name) {
    //   this.mentservice.chatser.native.alert("请输入案件名称");
    //   return false;
    // }
    // if (!this.ajaxdata.departmentID) {
    //   this.mentservice.chatser.native.alert("请选择上报部门");
    //   return false;
    // }
    // if (!this.ajaxdata.type) {
    //   this.mentservice.chatser.native.alert("请选择案件类型");
    //   return false;
    // }

    // this.mentservice.addEvent(this.ajaxdata).subscribe(data => {
    //   var rt = data.json();
    //   if (!rt.success) {
    //     this.mentservice.chatser.native.alert("请稍后再试");
    //     return false;
    //   }
    //   this.navCtrl.push("stepPage", { "eid": rt.success });
    // });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CaseReportPage');
  }

}
