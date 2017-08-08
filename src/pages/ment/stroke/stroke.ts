import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeService } from "../../../providers/NativeService";
import { HttpService } from "../../../providers/http.service";
/**
 * Generated class for the StrokePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-stroke',
  templateUrl: 'stroke.html',
})
export class StrokePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public native: NativeService, private httpService: HttpService, ) {
  }

  ionViewDidLoad() {
    this.getpersonEvent();
    console.log('ionViewDidLoad StrokePage');
  }
  strokeList = new Array();//事件列表
  getpersonEvent() {//获取今日日程
    let requestInfo = {
      url: "mobilegrid/getpersonworkregion",
      personID: this.native.UserSession._id
    }
    this.httpService.post(requestInfo.url, requestInfo).subscribe(data => {
      try {
        let res = data.json();
        if (res.error) {
          this.native.showToast(res.error.error);
        } else {
          this.strokeList = res.success;
          //获取区域数据
          for (var i = 0; i < this.strokeList.length; i++) {
            this.httpService.post("", {}).subscribe(data => {
              this.strokeList[i].quyumodel = data.json().success;
            });
          }
        }
      } catch (error) {
        this.native.showToast(error);
      }
    }, err => {
      this.native.showToast(err);
    });
  }
  goOtherPage(obj) {//去其他页面
    //回首页地图对接,定位区域地址
  }
}
