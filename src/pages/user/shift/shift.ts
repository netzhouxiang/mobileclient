import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
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
    requestInfo = {
        url: "changeshifts/add",
        work_id: '',
        region_id: '',
        to_user_id: '',
        to_name: '',
        change_content: ''
    }
    worklist = [];
    constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public native: NativeService, private httpService: HttpService, private chatser: ChatService) {

    }
    //获取工作
    getwork() {
        let requestInfo = {
            url: "works/list",
            user_id: this.native.UserSession._id,
            length: 10000,
            start_index: "0",
            isHandle: 0
        }
        this.httpService.post(requestInfo.url, requestInfo).subscribe(data => {
            try {
                let res = data.json();
                if (res.code == 200) {
                    this.worklist = res.info.list;
                } else {
                    this.native.showToast(res.info);
                }
            } catch (error) {
                this.native.showToast(error);
            }
        }, err => {
            this.native.showToast(err);
        });
    }
    selectShit() {
        let profileModal = this.modalCtrl.create('NewperPage', {});
        profileModal.onDidDismiss(res => {
            if (res) {
                //接受user
                this.requestInfo.to_user_id = res._id;
                this.requestInfo.to_name = res.name;
            }
        });
        profileModal.present();
    }
    ionViewDidLoad() {
        this.getwork();
        console.log('ionViewDidLoad ShiftPage');
    }
    sendMsg() {
        if (!this.requestInfo.work_id) {
            this.native.showToast('请选择换班工作');
            return false;
        }
        if (!this.requestInfo.to_user_id) {
            this.native.showToast('请选择换班人');
            return false;
        }
        if (!this.requestInfo.change_content) {
            this.native.showToast('请填写换班原因');
            return false;
        }
        this.worklist.forEach(item => {
            if (item._id == this.requestInfo.work_id) {
                this.requestInfo.region_id = item.region_id;
                return false;
            }
        });
        this.httpService.post(this.requestInfo.url, this.requestInfo).subscribe(data => {
            try {
                let res = data.json();
                if (res.code == 200) {
                    this.native.showToast('申请成功，待对方确认');
                } else {
                    this.native.showToast(res.info);
                }
            } catch (error) {
                this.native.showToast(error);
            }
        }, err => {
            this.native.showToast(err);
        });
    }
    opentongzhi() {
        let modal = this.modalCtrl.create('LeaveListPage', { type: "1" });
        modal.present();
    }
}
