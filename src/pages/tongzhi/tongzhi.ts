﻿import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, ModalController } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
import { HttpService } from "../../providers/http.service";
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
    constructor(public modalCtrl: ModalController, public navCtrl: NavController, public viewCtrl: ViewController, public native: NativeService, private httpService: HttpService) {
        console.log(this.navCtrl)
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
                    console.log(this.msglistTs)
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
  doRefresh(refresher) {// 做刷新处理
    this.getList()
    setTimeout(() => {
      refresher.complete();
    }, 3000);
  }
    jumpPage(e) {
      console.log(e)
        if (e.type == 0) {
            return;
        }
        if (e.type == 1) {
          // this.navCtrl.push('StrokePage', { event: 3 });
          // this.navCtrl.pop({aa:3});
          this.viewCtrl.dismiss({page:'StrokePage'});

        }
        if (e.type == 2) {
            //根据案件id获取 类型
            // if(!e.type_id){
            //   return;
            // }
            let requestInfo = {
                url: "event/get",
                _id: e.type_id
            }
            this.httpService.post(requestInfo.url, requestInfo).subscribe(data => {
                this.native.showLoading();
                try {
                    let res = data.json();
                    if (res.code == 200) {
                        var _type_id = res.info.type_id;
                        let requestInfo2 = {
                            url: "event_type/get",
                            _id: _type_id
                        }
                        this.httpService.post(requestInfo2.url, requestInfo2).subscribe(data_ev => {
                            var res2 = data_ev.json();
                            if (res2.code == 200) {
                                var _event = res2.info;
                                if (e.content.indexOf("尽快处理") > -1) {
                                    this.navCtrl.push('verifyPage', { event: _event });
                                } else {
                                    this.navCtrl.push('UpcomingPage', { event: _event });
                                }
                            } else {
                                this.native.showToast(res.info);
                            }
                        });
                    } else {
                        this.native.showToast(res.info);
                    }
                } catch (error) {
                    this.native.showToast(error);
                }
            }, err => {
                this.native.showToast(err);
            });
            return;
        }
        if (e.type == 3) {
            if (e.content.indexOf("请处理") > -1) {
                this.navCtrl.push('ApprovalPage', { type: "shift" });
            } else {
                this.navCtrl.push('LeaveListPage', { type: "1" });
            }
            return;
        }
        if (e.type == 4) {
            if (e.content.indexOf("请处理") > -1) {
                this.navCtrl.push('ApprovalPage', { type: "leave" });
            } else {
                this.navCtrl.push('LeaveListPage', { type: "0" });
            }
            return;
        }
    }
    ionViewDidLoad() {
        this.getList();
    }
    dismiss() {
        this.viewCtrl.dismiss();
    }

}
