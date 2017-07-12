﻿import { Component } from '@angular/core';
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

    constructor(public navCtrl: NavController, public navParams: NavParams, public native: NativeService, private httpService: HttpService, public modalCtrl: ModalController, private chatser: ChatService) {
    }
    minDate = Utils.dateFormat(new Date());
    requestInfo = {
        startTime: Utils.dateFormat(new Date()),
        endTime: Utils.dateFormat(new Date()),
        text: "",
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
    sendMsg() {
        if (!this.requestInfo.text) {
            this.native.alert('请填写理由');
            return false;
        }
        this.chatser.sendAbnormaMsg(this.requestInfo.text, "takeoff", this.requestInfo.startTime, this.requestInfo.endTime, "title", []);
        this.native.showToast('发送成功');
    }
    opentongzhi() {
        let modal = this.modalCtrl.create('TongzhiPage', { type: "0" });
        modal.present();
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad LeavePage');
    }

}
