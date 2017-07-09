import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Utils } from "../../../providers/Utils";
import { NativeService } from "../../../providers/NativeService";
import { HttpService } from "../../../providers/http.service";
/**
 * Generated class for the LeavePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-leave',
  templateUrl: 'leave.html',
})
export class LeavePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public native: NativeService, private httpService: HttpService,) {
  }
  minDate=Utils.dateFormat(new Date());
  requestInfo={
    url:"/personalinfo/sendpersonaskforleave",
    personID:this.native.UserSession._id,
    startTime:Utils.dateFormat(new Date()),
    endTime:Utils.dateFormat(new Date()),
    reason:''
  }
  compareTime(type) {//限制始日期不能大于终日期
      let strDate = new Date(this.requestInfo.startTime).getTime();
      let endDate = new Date(this.requestInfo.endTime).getTime();
      if (strDate < endDate) {
          return false;
      }
      if (type) {
          this.requestInfo.startTime = this.requestInfo.endTime;
      } else {
          this.requestInfo.endTime = this.requestInfo.startTime;
      }
  }
  sendMsg(){
    if(!this.requestInfo.reason){
      this.native.alert('请填写理由');
      return false;
    }
    this.httpService.post(this.requestInfo.url,this.requestInfo).subscribe(data=>{
      try {
        let res=data.json();
        if(res.success){
          this.native.showToast('信息发送成功');
        }
      } catch (error) {
        this.native.showToast(error);
      }
    },err=>{
      this.native.showToast(err);
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LeavePage');
  }

}