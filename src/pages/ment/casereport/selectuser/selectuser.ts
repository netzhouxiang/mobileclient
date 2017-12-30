import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { NativeService } from "../.././../../providers/NativeService";
import { ChatService } from "../.././../../providers/chat-service";

@IonicPage({
    name:'SelectUserPage'
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
        for (var a = 0; a < this.chatser.deptlist.length; a++) {
            for (var b = 0; b < this.chatser.deptlist[a].persons.length; b++) {
                if (this.nativeService.UserSession._id != this.chatser.deptlist[a].persons[b].person._id) {
                    var user = {
                        deptid: this.chatser.deptlist[a]._id,
                        name: this.chatser.deptlist[a].persons[b].person.name,
                        role: this.chatser.deptlist[a].persons[b].role,
                        _id: this.chatser.deptlist[a].persons[b].person._id,
                        checked: false
                    };
                    for (var i = 0; i < this.loguser.length; i++) {
                        if (user._id == this.loguser[i]._id) {
                            user.checked = true;
                        }
                    }
                    this.userlists.push(user);
                }
            }
        }
        
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
