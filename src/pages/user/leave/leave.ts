import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Utils } from "../../../providers/Utils";
import { NativeService } from "../../../providers/NativeService";
import { HttpService } from "../../../providers/http.service";
import { ChatService } from "../../../providers/chat-service";
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
    qjuser: any = null;
    minDate = null;
    minDate_end = null;
    requestInfo = {
        startTime: null,
        endTime: null,
        text: "",
    }
    constructor(public navCtrl: NavController, public navParams: NavParams, public native: NativeService, private httpService: HttpService, public modalCtrl: ModalController, private chatser: ChatService) {
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
    sendMsg() {
        if (!this.native.UserSession.title) {
            this.native.showToast('没有获取到当前用户职称，无法请假');
            return false;
        }
        if (!this.qjuser || !this.qjuser.length) {
            this.native.showToast('没有获取到此用户上一级领导，无法请假');
            return false;
        }
        if (!this.requestInfo.text) {
            this.native.alert('请填写理由');
            return false;
        }
        this.chatser.sendAbnormaMsg(this.requestInfo.text, "takeoff", this.requestInfo.startTime, this.requestInfo.endTime, "title", [this.qjuser[0]._id]);
        this.native.showToast('发送成功，请等待领导批复');
    }
    opentongzhi() {
        let modal = this.modalCtrl.create('TongzhiPage', { type: "0" });
        modal.present();
    }
    ionViewDidLoad() {
        if (!this.native.UserSession.title) {
            this.native.showToast('没有获取到当前用户职称，无法请假');
            return;
        }
        //获取当前用户上级部门
        var msgdata = {
            title: this.native.UserSession.title,
            hideloading: true
        }
        this.httpService.post("personadminroute/getpersontitlelevel", msgdata).subscribe(data => {
            this.qjuser = data.json().success;
        });
        console.log('ionViewDidLoad LeavePage');
    }

}
