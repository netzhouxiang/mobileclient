import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { ChatService } from "../../providers/chat-service";
import { NativeService } from "../../providers/NativeService";
import { retry } from 'rxjs/operator/retry';
/**
 * Generated class for the ChatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-chat',
    templateUrl: 'chat.html',
})
export class ChatPage {
    pet: string = "chatlog";
    searchKey: string = "";
    ChatUserPage: any = 'ChatUserPage';
    public noreadmsglist = [];
    public grouplist = [];
    public deptUserlist = [];
    public deptUserlist_show = [];
    chatlog_persons = [];
    logmsg = '正在获取聊天记录';
    public isLoad = false;
    constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public chatser: ChatService, public events: Events, public native: NativeService) {
        this.native.showLoading();
    }
    changelogmessage() {
        this.logmsg = '最近没有聊天';
        if ((<any>window).JMessage) {
            (<any>window).JMessage.getConversations((conArr) => { // conArr: 会话数组。
                this.chatlog_persons = conArr;
                this.chatlog_persons.forEach(item => {
                    if (item.conversationType == "single") {
                        var user = this.chatser.getUser(item.target.username);
                        item._id = user._id;
                        item.title = user.name;
                    }
                });
            });
        }
    }
    showChat(name) {
        return name.indexOf(this.searchKey) > -1;
    }
    getItems(ev) {
        this.searchKey = ev.target.value;
    }
    tab_change() {
        if (this.deptUserlist_show.length == 0) {
            this.deptUserlist_show = this.deptUserlist.concat();
        }
    }
    //部门与用户数据展示处理
    dept_user() {
        if (this.native.DeptList && this.native.DeptList.length > 0 && this.native.UserList && this.native.UserList.length > 0) {
            this.native.DeptList.forEach(_dept => {
                var m = {
                    dept: _dept,
                    user: []
                };
                this.native.UserList.forEach(_user => {
                    if (_user.department_id == _dept._id) {
                        _user.username = "yzwg_" + _user._id;
                        m.user.push(_user);
                    }
                });
                this.deptUserlist.push(m);
            });
            this.isLoad = true;
        }
        if (!this.isLoad) {
            setTimeout(() => {
                this.dept_user();
            }, 1000);
        }
    }
    //获取群组
    getGroup() {
        this.grouplist = [];
        if ((<any>window).JMessage) {
            (<any>window).JMessage.getGroupIds((groupIdArr) => {  // 群组 id 数组
                groupIdArr.forEach(_id => {
                    (<any>window).JMessage.getGroupInfo({ id: _id },
                        (groupInfo) => {
                            this.grouplist.push(groupInfo);
                        })
                });
            })
        }
    }
    go_qun() {
        this.native.alert('功能开发中');
    }
    //创建会话
    go_user(_id) {
        this.navCtrl.push('ChatUserPage', {
            username: 'yzwg_' + _id
        });
    }
    // delusermsg(touserid) {
    //     var iscz = false;
    //     if (touserid != "000000") {
    //         this.chatser.xhFun(function (user, _self) {
    //             if (user.person._id == touserid) {
    //                 iscz = true;
    //                 _self.events.publish('tab:delnum', user.msg.count);
    //                 user.msg.count = 0
    //                 _self.del_logmessage(touserid);
    //                 return true;
    //             }
    //             return false;
    //         });
    //     }
    //     if (!iscz) {
    //         for (var i = 0; i < this.chatlog_persons.length; i++) {
    //             if (this.chatlog_persons[i]._id == touserid) {
    //                 this.events.publish('tab:delnum', this.chatlog_persons[i].count);
    //                 this.chatser.del_logmessage(touserid);
    //             }
    //         }

    //     }
    //     //延迟200
    //     setTimeout(() => {
    //         this.changelogmessage();
    //     }, 200);
    // }
    getmsg(model) {
        if (!model) {
            return "";
        }
        if (model.type == "text") {
            return model.text;
        }
        if (model.type == "custom") {
            switch (model.customObject.type) {
                case "voice":
                    return "[语音]";
                case "video":
                    return "[视频]";
                case "image":
                    return "[图片]";
            }
        }
        return "[未知消息]";
    }
    ionViewDidEnter() {
        this.events.subscribe('chatlist:received', (msg) => {
            console.log(msg);
            //this.updateUserMsg(msg);
        });
        this.events.subscribe('chatlist:load', (touserid) => {
        });
        this.events.subscribe('chatlist:sx', (touserid) => {
            //延迟200
            setTimeout(() => {
                this.changelogmessage();
            }, 500);
        });
    }
    addqun() {
        let profileModal = this.modalCtrl.create('AddqunPage', {});
        profileModal.onDidDismiss(res => {
            if (res) {
                this.getGroup();
            }
        });
        profileModal.present();
    }
    ionViewDidLoad() {
        this.changelogmessage();
        this.getGroup();
        this.dept_user();
        //console.log(this.deptlist);
        this.native.hideLoading();
    }
    go(type, phone, event) {
        location.href = type == 0 ? "sms:" : "tel:" + phone;
        event.stopPropagation();
    }
    ReleaseMsg() {
        let modal = this.modalCtrl.create('SelectPage', { dept: this.chatser.deptlist });
        modal.present();
    }
}
