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

  constructor(public navCtrl: NavController, public navParams: NavParams,public native: NativeService, private httpService: HttpService,) {
  }

  ionViewDidLoad() {
    this.getpersonEvent();
    console.log('ionViewDidLoad StrokePage');
  }
  strokeList=new Array();//事件列表
  getpersonEvent(){//获取今日日程
    let requestInfo={
      url:"mobilegrid/getAllConcreteevent",
      departmentID:this.native.UserSession.departments[0].department
    }
    this.httpService.post(requestInfo.url,requestInfo).subscribe(data=>{
        try {
          let res=data.json();
          if(res.error){
            this.native.showToast(res.error.error);
          }else{
            this.strokeList=res.success;
          }
        } catch (error) {
          this.native.showToast(error);
        }
      },err=>{
        this.native.showToast(err);
      });
  }
}
