import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MentService } from "../../ment.service";

@IonicPage()
@Component({
  selector: 'page-step',
  templateUrl: 'step.html',
})
export class stepPage {
  contorl_list = [];
  subdata = {
    eventID: "",
    arguments: [],
    setwho: this.mentservice.chatser.native.UserSession._id
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, public mentservice: MentService) {
    //待接受案件id 待处理定位与法律依据
    this.subdata.eventID = navParams.get("sid");
    if (navParams.get("sid")) {
      //拿到当前步骤id，根据步骤id获取当前步骤参数
      this.mentservice.getargutostep(navParams.get("sid")).subscribe(data_cur => {
        if (!data_cur.json().success) {
          this.mentservice.chatser.native.alert("抱歉，暂未查到相关步骤");
          return;
        }
        this.contorl_list = data_cur.json().success;
        //扩充
        for (var i = 0; i < this.contorl_list.length; i++) {
          if (this.contorl_list[i].value.length == 0) {
            this.contorl_list[i].showvalue = "";
          } else {
            this.contorl_list[i].showvalue = this.contorl_list[i].value[this.contorl_list[i].value.length - 1];
          }
        }
      });
    }
  }
  //循环添加数据
  xhadd() {
    for (var i = 0; i < this.contorl_list.length; i++) {
      this.subdata.arguments.push({
        arguid: this.contorl_list[i]._id,
        value: this.contorl_list[i].showvalue
      });
    }
  }
  alertsuc() {
    //提交成功
    this.mentservice.chatser.native.alert("提交成功", function () {
      //返回对应 页面 暂时不处理
    });
  }
  //保存参数
  saveclick() {
    this.xhadd();
    this.mentservice.sendeventargument(this.subdata).subscribe(data => {
      this.alertsuc();
    })
  }
  //提交审核，检测参数是否填写完整
  upclick() {
    var issub = true;
    var title = "";
    for (var i = 0; i < this.contorl_list.length; i++) {
      if (!this.contorl_list[i].showvalue) {
        title = this.contorl_list[i].promptvalue;
        issub = false;
        break;
      }
    }
    if (!issub) {
      this.mentservice.chatser.native.alert(title + "没有数据，不能提交审核");
      return;
    }
    this.xhadd();
    this.mentservice.sendeventargumentpush(this.subdata).subscribe(data => {
      this.alertsuc();
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad stepPage');
  }

}
