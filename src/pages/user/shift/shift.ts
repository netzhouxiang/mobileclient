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
    minDate = null;
    minDate_end = null;
    requestInfo = {
        startTime: null,
        endTime: null,
        id: '',
        shiftname: ''
    }
    constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public native: NativeService, private httpService: HttpService, private chatser: ChatService) {
        var to_time = new Date();
        to_time.setDate(to_time.getDate() + 1);
        this.minDate = Utils.dateFormat(to_time);
        this.requestInfo.startTime = Utils.dateFormat(to_time);
        to_time.setDate(to_time.getDate() + 1);
        this.requestInfo.endTime = Utils.dateFormat(to_time);
    }
    compareTime(type) {//限制始日期不能大于终日期
        let xx = new Date(this.requestInfo.startTime);
        xx.setDate(xx.getDate() + 1);
        this.minDate_end = Utils.dateFormat(xx);
        if (this.requestInfo.endTime < this.minDate_end) {
            this.requestInfo.endTime = this.minDate_end;
        }
        // let strDate = new Date(this.requestInfo.startTime).getTime();
        // let endDate = new Date(this.requestInfo.endTime).getTime();
        // if (strDate < endDate) {
        //     return false;
        // }
        // if (type) {
        //     this.requestInfo.startTime = this.requestInfo.endTime;
        // } else {
        //     this.requestInfo.endTime = this.requestInfo.startTime;
        // }
    }
    selectShit() {
        let profileModal = this.modalCtrl.create('NewperPage', {});
        profileModal.onDidDismiss(res => {
            if (res) {
                //接受user
                this.requestInfo.id = res._id;
                this.requestInfo.shiftname = res.name;
            }
        });
        profileModal.present();
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad ShiftPage');
    }
    sendMsg() {
        if (!this.requestInfo.id) {
            this.native.showToast('请选择换班人');
            return false;
        }
        // this.chatser.sendAbnormaMsg('申请换班', 'shift', this.requestInfo.startTime, this.requestInfo.endTime, 'person', [this.requestInfo.id]);
         this.native.showToast('申请成功，待对方确认');
    }
    opentongzhi() {
        let modal = this.modalCtrl.create('TongzhiPage', { type: "1" });
        modal.present();
    }
}
