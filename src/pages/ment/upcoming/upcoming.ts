﻿import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeService } from "../../../providers/NativeService";
import { HttpService } from "../../../providers/http.service";
import { MentService } from "../ment.service";
/**
 * Generated class for the UpcomingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-upcoming',
    templateUrl: 'upcoming.html',
})
export class UpcomingPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, public native: NativeService, private httpService: HttpService, public mentservice: MentService, ) {
    }

    ionViewDidLoad() {
        this.getpersonEvent();
    }
    upcomList = new Array();//事件列表
    getpersonEvent() {//获取人员待办事件
        var event = this.navParams.get("event");
        //console.log(this.navParams.get("event"));
        let requestInfo = {
            url: "event/list",
            //user_id: this.native.UserSession._id,
            length: 10000,
            start_index: "0",
            department_id: this.native.UserSession.department_sub,
            type_id: event._id,
            step_status: "0"
        }
        this.httpService.post(requestInfo.url, requestInfo).subscribe(data => {
            try {
                let res = data.json();
                if (res.code == 200) {
                    this.upcomList = res.info.list;
                    this.upcomList.forEach(item => {
                        item.para_name = "正在获取";
                        this.getCurStep(item);
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
    }
    getCurStep(row) {
        let requestInfo = {
            url: "event/get_step",
            event_id: row._id,
            hideloading: true
        }
        this.httpService.post(requestInfo.url, requestInfo).subscribe(data => {
            try {
                let res = data.json();
                if (res.code == 200) {
                    this.httpService.post("steps/get", { _id: res.info.step_id, hideloading: true }).subscribe(_data => {
                        let _res = _data.json();
                        row.para_name = _res.info.name;
                    });
                } else { }
            } catch (error) {
            }
        }, err => {
        });
    }
    goOtherPage(obj) {//去其他页面
        this.navCtrl.push("stepPage", { "eid": obj._id, "add": "1" });
        // this.mentservice.getcurrentstep(obj._id).subscribe(data=>{
        //     try {
        //         let res = data.json();
        //         if (res.error) {
        //             this.native.showToast(res.error.error);
        //         } else {
        //             let arr = res.success[res.success.length - 1];
        //             this.navCtrl.push("stepPage", { "sid": arr._id, "eid": obj._id, "deptid": obj.department });
        //         }
        //     } catch (error) {
        //         this.native.showToast(error);
        //     }
        // }, err => {
        //     this.native.showToast(err);
        // })
    }
}
