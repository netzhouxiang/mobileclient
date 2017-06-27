import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { HttpService } from "../../providers/http.service";
import { NativeService } from "../../providers/NativeService";
import { ChatService } from "../../providers/chat-service";
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
    ChatUserPage: any = 'ChatUserPage';
    public deptlist = new Array();
    public noreadmsglist = [];
    constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpService, public native: NativeService, public chatser: ChatService, public events: Events) {
        //获取当前登录用户的部门结构人员
        this.native.showLoading();
        this.loaduser(this.native.UserSession.departments);
    }
    loaduser(dept) {
        let requestInfo = {
            url: "department/getAllpersonsByDepartIdOneStep",
            _id: dept[0].department,
            hideloading: true
        }
        this.httpService.post(requestInfo.url, requestInfo).subscribe(
            data => {
                this.deptlist.push(data.json());
                dept.splice(0, 1);
                if (dept.length > 0) {
                    this.loaduser(dept);
                } else {
                    
                    //this.updatelsmsg(true);
                }
            },
            err => console.error(err)
        );
    }
    updatelsmsg(one) {
        for (var a = 0; a < this.deptlist.length; a++) {
            for (var b = 0; b < this.deptlist[a].persons.length; b++) {
                this.getnoreadnum(this.deptlist[a].persons[b], one);
            }
        }
    }

    //未读消息处理添加 
    updateUserMsg(msg) {
        for (var a = 0; a < this.deptlist.length; a++) {
            var dept = this.deptlist[a];
            for (var b = 0; b < dept.persons.length; b++) {
                if (dept.persons[b].person._id == msg.sender) {
                    dept.persons[b].msg = {
                        count: 1,
                        text: msg.text
                    }
                    break;
                }
            }
        }
    }
    //未读标记删除
    delusermsg(touserid) {
        for (var a = 0; a < this.deptlist.length; a++) {
            for (var b = 0; b < this.deptlist[a].persons.length; b++) {
                if (this.deptlist[a].persons[b].person._id == touserid) {
                    this.deptlist[a].persons[b].msg.count = 0;
                    break;
                }
            }
        }
    }
    ionViewDidEnter() {
        this.events.subscribe('chatlist:received', (msg) => {
            console.log(msg);
            this.updateUserMsg(msg);
        });
        this.events.subscribe('chatlist:del', (touserid) => {
            this.delusermsg(touserid);
        });
    }
    ionViewDidLoad() {
        this.updatelsmsg(false);
        this.native.hideLoading();
        console.log(this.deptlist);
    }
    go(type, phone) {
        location.href = type == 0 ? "sms:" : "tel:" + phone;
    }
    //获取历史消息对象
    getnoreadnum(user, one) {
        var m = {
            count: 0,
            text: ''
        };
        user.msg = m;
        if (!one) {
            this.chatser.getMsgList(this.native.UserSession._id, user.person._id).then(res => {
                if (!res) {
                    res = [];
                }
                var msgList = res;
                if (msgList.length > 0) {
                    var msgmodel = msgList[msgList.length - 1];
                    switch (msgmodel.msgtype) {
                        case 0:
                            m.text = msgmodel.message;
                            break;
                        case 1:
                            m.text = "语音";
                            break;
                        case 2:
                            m.text = "图片";
                            break;
                        case 3:
                            m.text = "视频";
                            break;
                    }
                    m.count = msgmodel.isread;
                }
                user.msg = m;
            });
        }

    }
}
