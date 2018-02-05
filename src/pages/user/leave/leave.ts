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
        url:'leaves/add',
        start_time: '',
        end_time: '',
        start_time_t: '',
        end_time_t: '',
        leavecontent: ''
    }
    constructor(public navCtrl: NavController, public navParams: NavParams, public native: NativeService, private httpService: HttpService, public modalCtrl: ModalController, private chatser: ChatService) {
        var to_time = new Date();
        to_time.setDate(to_time.getDate() + 1);
        this.minDate = Utils.dateFormat(to_time);
        this.requestInfo.start_time_t = Utils.dateFormat(to_time);
        to_time.setDate(to_time.getDate() + 1);
        this.requestInfo.end_time_t = Utils.dateFormat(to_time);
    }


    compareTime(type) {//限制始日期不能大于终日期
        let xx = new Date(this.requestInfo.start_time_t);
        xx.setDate(xx.getDate());
        this.minDate_end = Utils.dateFormat(xx);
        if (this.requestInfo.end_time_t < this.minDate_end) {
            this.requestInfo.end_time_t = this.minDate_end;
        }
    }
    sendMsg() {
        if (!this.native.UserSession._id) {
            this.native.showToast('获取当前用户信息出错');
            return false;
        }
        if (!this.requestInfo.leavecontent) {
            this.native.alert('请填写理由');
            return false;
        }
        this.requestInfo.start_time = Math.round(new Date(this.requestInfo.start_time_t).getTime() / 1000)+'';
        this.requestInfo.end_time = Math.round(new Date(this.requestInfo.end_time_t).getTime() / 1000)+ '';
        this.httpService.post(this.requestInfo.url, this.requestInfo).subscribe(data => {
            try {
                let res = data.json();
                if (res.code == 200) {
                    this.native.alert('申请成功！');
                } else {
                    this.native.showToast(res.error);
                }
            } catch (error) {
                this.native.showToast(error);
            }
        },err => {
            this.native.showToast('申请失败，请稍后再试');
        })
        //this.chatser.sendAbnormaMsg(this.requestInfo.text, "takeoff", this.requestInfo.start_time_t, this.requestInfo.end_time_t, "title", [this.qjuser[0]._id]);
    }
    opentongzhi() {
        let modal = this.modalCtrl.create('LeaveListPage', { type: "0" });
        modal.present();
    }
    ionViewDidLoad() {
        if (!this.native.UserSession._id) {
            this.native.showToast('获取当前用户信息出错');
            return;
        }
        console.log('ionViewDidLoad LeavePage');
    }

}
