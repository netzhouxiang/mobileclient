import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController } from 'ionic-angular';
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
    msglistTs: any = new Array();
    showtype: string;
    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public native: NativeService, private httpService: HttpService, private chatser: ChatService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, ) {
        this.getList();
        this.showtype = navParams.get("type");
    }
    //获取通知
    getList() {
        this.chatser.getMsgListTs().then(res => {
            if (!res) {
                res = [];
            }
            for (var i = 0; i < res.length; i++) {
                if (res[i].type == this.showtype) {
                    this.msglistTs.push(res[i]);
                }
            }

        });
    }
    loading = null;
    //同意或拒绝
    approve(msg, ok) {
        let confirm = this.alertCtrl.create({
            title: "提示",
            message: "您确定要" + (ok ? "同意" : "拒绝") + "该" + (this.showtype == "0" ? "请假" : "换班") + "吗",
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                    cssClass: 'cus-cancel',
                    handler: () => {
                    }
                },
                {
                    text: '确定',
                    handler: () => {
                        this.loading = this.loadingCtrl.create({
                            content: ""
                        })
                        this.loading.present();
                        this.httpService.post("message/readtAbnormalMessage", {
                            messID: msg.msgid,
                            decision: ok ? "approve" : "reject",
                            curUserID: this.native.UserSession._id,
                            abnormalID: msg.abnormalID,
                            hideloading: true
                        }).subscribe(data => {
                            this.loading.dismiss();
                            //标记当前操作已处理
                            this.chatser.changeread(msg.msgid, (ok ? "同意" : "拒绝"));
                        });
                    }
                }
            ]
        });
        confirm.present();
    }
    totime(t) {
        var time = new Date(t);
        return Utils.dateFormatTime(time.getTime(), "YYYY-MM-DD HH:mm")
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad NewperPage');
    }
    dismiss() {
        this.viewCtrl.dismiss();
    }

}
