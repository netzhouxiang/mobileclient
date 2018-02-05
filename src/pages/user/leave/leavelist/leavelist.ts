import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { NativeService } from "../../../../providers/NativeService";
import { HttpService } from "../../../../providers/http.service";
/**
 * Generated class for the UpcomingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-leavelist',
    templateUrl: 'leavelist.html',
})
export class LeaveListPage {
    showtype = '0';
    constructor(public navCtrl: NavController, public navParams: NavParams, public native: NativeService, private httpService: HttpService, public viewCtrl: ViewController, ) {
    }
    ionViewDidLoad() {
        this.showtype = this.navParams.get("type");
        this.getpersonEvent();
    }
    LeaveList = new Array();
    getpersonEvent() {
        let requestInfo = {
            url: "leaves/list",
            user_id: this.native.UserSession._id,
            length: 10000,
            start_index: "0",
        }
        if (this.showtype != '0') {
            requestInfo.url = "changeshifts/list";
        }
        // if (this.native.UserSession.department_sub != "") {
        //     requestInfo.user_id = this.native.UserSession._id;
        // }
        // if (this.native.IsAccess(82)) {
        //     requestInfo.department_id = this.native.UserSession.department_sub;
        // }
        this.httpService.post(requestInfo.url, requestInfo).subscribe(data => {
            try {
                let res = data.json();
                if (res.code == 200) {
                    this.LeaveList = res.info.list;
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
    dismiss() {
        this.viewCtrl.dismiss();
    }
}
