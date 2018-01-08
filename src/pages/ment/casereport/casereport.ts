import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { MentService } from "../ment.service";
/**
 * Generated class for the StrokePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-casereport',
    templateUrl: 'casereport.html',
})
export class CaseReportPage {
    //eventlist = [];
    ajaxdata = {
        name: "",
        type_id: "",
        step_ids: "",
        lat: 0,
        lon: 0,
        happen_time: 0,
        address: "",
        deptname: "",
        eventname: ""
    };
    constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, public mentservice: MentService) {
        console.log(this.mentservice.chatser.native.UserSession)
        let event = this.navParams.get("event");
        //this.ajaxdata.departmentID = event.department;
        this.ajaxdata.type_id = event._id;
        this.ajaxdata.deptname = this.mentservice.dept.name;
        this.ajaxdata.eventname = event.name;
        //自动案件名称

        let totime = new Date();
        this.ajaxdata.name = totime.getFullYear() + "-" + (totime.getMonth() + 1) + "-" + totime.getDate() + "[" + parseInt(this.mentservice.location.loc[0].toString()) + "," + parseInt(this.mentservice.location.loc[1].toString()) + "]" + this.ajaxdata.eventname;
    }
    //下一步，提交参数
    nextclick() {
        if (!this.ajaxdata.name) {
            this.mentservice.chatser.native.alert("请输入案件名称");
            return false;
        }
        this.mentservice.addEvent(this.ajaxdata).subscribe(data => {
            var rt = data.json();
            if (!rt.success) {
                this.mentservice.chatser.native.alert("请稍后再试");
                return false;
            }
            //"deptid": this.ajaxdata.departmentID,
            this.navCtrl.push("stepPage", { "eid": rt.success.case, "sid": rt.success.step,  "add": "1" });
        });
    }
    //选择地址
    selectmap() {
        let profileModal = this.modalCtrl.create('LocationPage', {});
        profileModal.onDidDismiss(res => {
            if (res) {
                this.ajaxdata.address = res.name;
                this.ajaxdata.lat = res.location.lat;
                this.ajaxdata.lon = res.location.lng;
            }
        });
        profileModal.present();
    }
    ionViewDidLoad() {
        this.ajaxdata.address = this.mentservice.location.text;
        this.ajaxdata.lat = this.mentservice.location.loc[1];
        this.ajaxdata.lon = this.mentservice.location.loc[0];
    }

}
