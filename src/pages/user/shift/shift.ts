import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Utils } from "../../../providers/Utils";
import { NativeService } from "../../../providers/NativeService";
import { HttpService } from "../../../providers/http.service";
import { ChatService } from "../../../providers/chat-service";
/**
 * Generated class for the ShiftPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-shift',
  templateUrl: 'shift.html',
})
export class ShiftPage {

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public native: NativeService, private httpService: HttpService, private chatser: ChatService ) {
  }
  minDate = Utils.dateFormat(new Date());
  requestInfo = {
    url: ' /personalinfo/sendpersonshift',
    personID: this.native.UserSession._id,
    startTime: Utils.dateFormat(new Date()),
    endTime: Utils.dateFormat(new Date()),
    shift: '',
    shiftname: ''
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
  selectShit() {
    let profileModal = this.modalCtrl.create('NewperPage', {});
    profileModal.onDidDismiss(res => {
      if (res) {
          this.requestInfo.shift=res.shift;
          this.requestInfo.shiftname=res.shiftname;
      }
    });
    profileModal.present();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ShiftPage');
  }
  sendMsg() {
    if (!this.requestInfo.shift) {
      this.native.showToast('请选择换班人');
      return false;

    }
    this.httpService.post(this.requestInfo.url, this.requestInfo).subscribe(data => {
      try {
        let res = data.json();
        if (res.error) {
          this.native.showToast(res.error.error);

        } else {
          this.native.alert('换班发送成功', () => {
            this.navCtrl.pop();
          });
        }
      } catch (error) {
        this.native.showToast(error);
      }
    }, err => {
      this.native.showToast(err);
    });
  }
  opentongzhi() {
      let modal = this.modalCtrl.create('TongzhiPage', { type: "1" });
      modal.present();
  }
}
