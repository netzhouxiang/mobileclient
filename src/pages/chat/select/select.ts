import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { NativeService } from "../../../providers/NativeService";

/**
 * Generated class for the RegisttipPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-select',
    templateUrl: 'select.html',
})
export class SelectPage {
    pet2: string = "selectdept";
    deptlist: any;
    deptlists: any = [];
    userlists: any = [];
    joblist = [];
    joblists: any = [];
    constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, public viewCtrl: ViewController, public nativeService: NativeService) {
        this.deptlist = navParams.get('dept');
        this.jobload();
        console.log(this.deptlist);
    }
    //提取数据
    jobload() {
        for (var a = 0; a < this.deptlist.length; a++) {
            this.deptlists.push({
                name: this.deptlist[a].name,
                _id: this.deptlist[a]._id,
                checked: false
            });
            for (var b = 0; b < this.deptlist[a].persons.length; b++) {
                this.userlists.push({
                    name: this.deptlist[a].persons[b].person.name,
                    _id: this.deptlist[a].persons[b].person._id,
                    checked: false
                })
                var key = this.deptlist[a].persons[b].role;
                if (this.joblist.indexOf(key) === -1) {
                    this.joblist.push(key);
                    this.joblists.push({
                        role: key,
                        checked: false
                    });
                }
            }
        }
    }
    //发送消息
    sendmsg() {
        var count = 0;
        var msgobj = {
            dept: [],
            user: [],
            job: []
        };
        //检测部门是否选中,把选择的部门数据提取出来
        for (var i = 0; i < this.deptlists.length; i++) {
            if (this.deptlists[i].checked) {
                count++;
                msgobj.dept.push(this.deptlists[i]);
            }
        }
        //检测职位是否选中,把选择的职位数据提取出来
        for (var i = 0; i < this.joblists.length; i++) {
            if (this.joblists[i].checked) {
                count++;
                msgobj.job.push(this.joblists[i]);
            }
        }
        //检测人员是否选中,把选择的人员数据提取出来
        for (var i = 0; i < this.userlists.length; i++) {
            if (this.userlists[i].checked) {
                count++;
                msgobj.user.push(this.userlists[i]);
            }
        }
        if (!count) {
            this.nativeService.showToast("请选择发送人员");
            return;
        }
        let modal = this.modalCtrl.create('ChatUserPage', { msgobj: msgobj, qunfa: "1" });
        modal.present();
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad SelectPage');
    }
    dismiss() {
        this.viewCtrl.dismiss();
    }
}
