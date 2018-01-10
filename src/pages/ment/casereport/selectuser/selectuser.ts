import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { NativeService } from "../.././../../providers/NativeService";
import { ChatService } from "../.././../../providers/chat-service";

@IonicPage({
    name: 'SelectUserPage'
})
@Component({
    selector: 'page-selectuser',
    templateUrl: 'selectuser.html',
})
export class SelectUserPage {
    userlists: any = [];
    sendUserList = [];
    loguser = [];
    constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, public viewCtrl: ViewController, public nativeService: NativeService, public chatser: ChatService) {
        this.loguser = this.navParams.get("users");
    }
    //提取数据
    jobload() {
        var dept_ids = "," + this.nativeService.UserSession.department_sub + ",";
        this.nativeService.UserList.forEach(item => {
            var user = {
                deptid: 0,
                name: item.name,
                role: 0,
                _id: item._id,
                checked: false
            };
            item.department_roles.forEach(ud => {
                if (ud.is_enable == 1 && (this.nativeService.UserSession.department_sub == "" || dept_ids.indexOf("," + ud.department_id + ","))) {
                    user.deptid = ud.department_id;
                    user.role = ud.role_id;
                    return false;
                }
            });
            for (var i = 0; i < this.loguser.length; i++) {
                if (user._id == this.loguser[i]._id) {
                    user.checked = true;
                    break;
                }
            }
            this.userlists.push(user);
        });
    }
    //添加人员 去重 存在不添加
    adduser(user) {
        var isadd = true;
        for (var i = 0; i < this.sendUserList.length; i++) {
            if (this.sendUserList[i]._id == user._id) {
                isadd = false;
                break;
            }
        }
        if (isadd) {
            this.sendUserList.push(user);
        }
    }
    ionViewDidLoad() {
        this.jobload();
    }
    dismiss() {
        //检测人员是否选中,把选择的人员数据提取出来
        for (var i = 0; i < this.userlists.length; i++) {
            if (this.userlists[i].checked) {
                this.sendUserList.push(this.userlists[i]);
            }
        }
        this.viewCtrl.dismiss(this.sendUserList);
    }
}
