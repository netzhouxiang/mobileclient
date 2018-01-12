import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController, Events } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
import { HttpService } from "../../providers/http.service";
import { ChatService } from "../../providers/chat-service";
import { Utils } from "../../providers/Utils";
/**
 * Generated class for the NewperPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-tongzhi',
    templateUrl: 'tongzhi.html',
})
export class TongzhiPage {
    msglistTs = [];
    showtype: string;
    sms_id = "";
    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public native: NativeService, private httpService: HttpService, private chatser: ChatService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, public events: Events, ) {

    }
    //获取通知
    getList() {
        let requestInfo = {
            url: "sms/list",
            length: 10000,
            start_index: "0"
        }
        this.httpService.post(requestInfo.url, requestInfo).subscribe(data => {
            try {
                let res = data.json();
                if (res.code == 200) {
                    this.msglistTs = res.info.list;
                    this.msglistTs.forEach(item => {
                        if (item.isread == 0) {
                            this.sms_id += "," + item._id;
                        }
                    });
                    //标记已读
                    if (this.sms_id) {
                        this.sms_id = this.sms_id.substr(1);
                        let requestInfo_rd = {
                            url: "sms/read",
                            sms_id: this.sms_id
                        }
                        this.httpService.post(requestInfo_rd.url, requestInfo_rd).subscribe(data => { });
                    }
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
    ionViewDidLoad() {
        this.getList();
    }
    dismiss() {
        this.viewCtrl.dismiss();
    }

}
