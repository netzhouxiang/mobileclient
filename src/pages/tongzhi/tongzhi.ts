import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
import { HttpService } from "../../providers/http.service";
import { ChatService } from "../../providers/chat-service";
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
    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public native: NativeService, private httpService: HttpService, private chatser: ChatService) {
        this.getList();
        this.showtype = navParams.get("type");
    }
    //获取通知
    getList() {
        this.chatser.getMsgListTs().then(res => {
            if (!res) {
                res = [];
            }
            this.msglistTs = res;
        });
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad NewperPage');
    }
    dismiss() {
        this.viewCtrl.dismiss();
    }

}
