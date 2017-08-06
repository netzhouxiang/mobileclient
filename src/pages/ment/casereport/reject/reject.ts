import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MentService } from "../../ment.service";
/**
 * Generated class for the StrokePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var AMap, AMapUI;
@IonicPage()
@Component({
  selector: 'page-reject',
  templateUrl: 'reject.html',
})
export class rejectPage {
  anjian_model = null;
  step_model = null;
  map: any;//地图对象
  contorl_list = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public mentservice: MentService) {
    this.anjian_model = this.navParams.data;
  }
  //根据经纬度获取地址
  getaddress(model) {
    var geocoder = new AMap.Geocoder({
      radius: 1000,
      extensions: "all"
    });
    geocoder.getAddress(model.value, function (status, result) {
      if (status === 'complete' && result.info === 'OK') {
        model.showvalue = result.regeocode.formattedAddress;
        console.log(result);
      }
    });
  }
  ionViewDidLoad() {
    //获取当前案件待审核的步骤
    this.mentservice.getcurrentexaminestep(this.anjian_model._id).subscribe(data => {
      if (!data.json().success) {
        this.mentservice.chatser.native.showToast("暂未查到待审核步骤")
        return false;
      }
      this.step_model = data.json().success[data.json().success.length - 1];
      //根据步骤 获取参数
      //拿到当前步骤id，根据步骤id获取当前步骤参数 
      this.mentservice.getargutostep(this.step_model._id).subscribe(data_cur => {
        if (!data_cur.json().success) {
          this.mentservice.chatser.native.alert("抱歉，暂未查到相关步骤");
          return;
        }
        this.contorl_list = data_cur.json().success;
        //扩充
        for (var i = 0; i < this.contorl_list.length; i++) {
          this.contorl_list[i].showvalue = "";
          if (this.contorl_list[i].value.length > 0) {
            this.contorl_list[i].showvalue = this.contorl_list[i].value[this.contorl_list[i].value.length - 1];
          }
          if (this.contorl_list[i].type == "location") {
            if (this.contorl_list[i].showvalue) {
              this.getaddress(this.contorl_list[i]);
            }
          }
          if (this.contorl_list[i].type == "image") {
            this.contorl_list[i].showvalue = "查看图片";
          }
        }
      });
    });
  }
  verify(i) {
    
  }

}
