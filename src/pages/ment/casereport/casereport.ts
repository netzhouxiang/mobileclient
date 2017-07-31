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
    eventlist = [];
    ajaxdata = {
        name: "",
        type: "",
        departmentID: "",
        position: [],
        newwho: ""
    };
    constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, public mentservice: MentService) {
        this.ajaxdata.newwho = this.mentservice.chatser.native.UserSession._id;
        this.ajaxdata.position = this.mentservice.location.loc;
        mentservice.getAllAbstracttype().subscribe(data => {
            this.eventlist = data.json().success;
        });
    }
    //下一步，提交参数
    nextclick() {
        if (!this.ajaxdata.name) {
            this.mentservice.chatser.native.alert("请输入案件名称");
            return false;
        }
        if (!this.ajaxdata.departmentID) {
            this.mentservice.chatser.native.alert("请选择上报部门");
            return false;
        }
        if (!this.ajaxdata.type) {
            this.mentservice.chatser.native.alert("请选择案件类型");
            return false;
        }

        this.mentservice.addEvent(this.ajaxdata).subscribe(data => {
            var rt = data.json();
            if (!rt.success) {
                this.mentservice.chatser.native.alert("请稍后再试");
                return false;
            }
            this.navCtrl.push("stepPage", { "eid": rt.success.case, "sid": rt.success.stop, "deptid": this.ajaxdata.departmentID, "add": "1" });
        });
    }
    //选择地址
    selectmap() {
        let profileModal = this.modalCtrl.create('LocationPage', {});
        profileModal.onDidDismiss(res => {
            if (res) {
                this.mentservice.location.text = res.name;
                this.ajaxdata.position = [res.location.lng, res.location.lat];
            }
        });
        profileModal.present();
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad CaseReportPage');
    }

}
