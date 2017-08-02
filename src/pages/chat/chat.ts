import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
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
    pet: string = "chatlog";
    searchKey: string = "";
    ChatUserPage: any = 'ChatUserPage';
    public noreadmsglist = [];
    chatlog_persons = [];
    constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,public chatser: ChatService, public events: Events) {
    }
    changelogmessage() {
        this.chatser.get_logmessage().then((val) => {
            if (val) {
                this.chatlog_persons = val;
                console.log(this.chatlog_persons)
            }
        });
    }
    showChat(name) {
        return name.indexOf(this.searchKey) > -1;
    }
    getItems(ev) {
        this.searchKey = ev.target.value;
    }
    delusermsg(touserid) {
        var iscz = false;
        if (touserid != "000000") {
            this.chatser.xhFun(function (user, _self) {
                if (user.person._id == touserid) {
                    iscz = true;
                    _self.events.publish('tab:delnum', user.msg.count);
                    user.msg.count = 0
                    _self.del_logmessage(touserid);
                    return true;
                }
                return false;
            });
        }
        if (!iscz) {
            for (var i = 0; i < this.chatlog_persons.length; i++) {
                if (this.chatlog_persons[i]._id == touserid) {
                    this.events.publish('tab:delnum', this.chatlog_persons[i].count);
                    this.chatser.del_logmessage(touserid);
                }
            }

        }
        //延迟200
        setTimeout(() => {
            this.changelogmessage();
        }, 200);
    }
    ionViewDidEnter() {
        this.events.subscribe('chatlist:received', (msg) => {
            console.log(msg);
            //this.updateUserMsg(msg);
        });
        this.events.subscribe('chatlist:del', (touserid) => {
            this.delusermsg(touserid);
        });
        this.events.subscribe('chatlist:sx', (touserid) => {
            //延迟200
            setTimeout(() => {
                this.changelogmessage();
            }, 500);
        });
    }
    ionViewDidLoad() {
        this.changelogmessage();
        //console.log(this.deptlist);
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
