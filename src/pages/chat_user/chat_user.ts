import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, TextInput, Events } from 'ionic-angular';
import { ChatService, ChatMessage } from "../../providers/chat-service";
import { Storage } from '@ionic/storage';
import { Utils } from "../../providers/Utils";
/**
 * Generated class for the ChatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-chat_user',
    templateUrl: 'chat_user.html',
})
export class ChatUserPage {
    @ViewChild(Content) content: Content;
    @ViewChild('chat_input') messageInput: TextInput;
    msgList: ChatMessage[] = [];
    userId: string;
    userName: string;
    userImgUrl: string;
    toUserId: string;
    toUserName: string;
    toUserImg: string;
    editorMsg: string = '';
    pageindex = 1;
    pagenum = 10;
    showindex = 0;
    isdiyopen: boolean = false;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public chatService: ChatService,
        public storage: Storage,
        public events: Events,
        public ref: ChangeDetectorRef) {
        this.toUserId = navParams.data._id;
        this.toUserName = navParams.data.name;
        this.toUserImg = "assets/img/test_logo.png";
        this.chatService.getUserInfo()
            .then((res) => {
                this.userId = res.userId;
                this.userName = res.userName;
                this.userImgUrl = res.userImgUrl;
            })
    }
    ionViewDidLoad() {

    }
    ionViewWillLeave() {
        //离开页面 标记所有消息已读 暂时不考虑几万条消息之类的性能问题 后续优化
        for (var i = 0; i < this.msgList.length; i++) {
            this.msgList[i].isread = 0;
        }
        this.chatService.saveMsgList(this.userId, this.toUserId, this.msgList);
        //清除标记
        this.events.publish('chatlist:del', this.toUserId);
        // unsubscribe
        this.events.unsubscribe('chat:received')
        
    }
    toriqi(time) {
        return Utils.dateFormatTime(time, 'YYYY/MM/DD HH:mm:ss');
    }
    ionViewDidEnter() {
        // 获取缓存消息
        this.getMsg()
            .then(() => {
                this.scrollToBottom()
            });
        // 接受推送消息
        this.events.subscribe('chat:received', (msg) => {
            this.pushNewMsg(msg);
        })
    }

    _focus() {
        this.content.resize();
        this.scrollToBottom()
    }

    switchEmojiPicker() {
        this.isdiyopen = !this.isdiyopen;
        if (!this.isdiyopen) {
            this.messageInput.setFocus();
        }
        this.content.resize();
        this.scrollToBottom();
    }

    /**
    * @name getMsg
    * @returns {Promise<ChatMessage[]>}
    */
    getMsg() {
        //获取缓存消息
        return this.chatService
            .getMsgList(this.userId, this.toUserId)
            .then(res => {
                if (!res) {
                    res = [];
                }
                this.msgList = res;
                this.changeindex();
            })
            .catch(err => {
                console.log(err)
            })
    }
    //更新显示索引
    changeindex() {
        this.showindex = this.msgList.length - this.pageindex * this.pagenum > 0 ? this.msgList.length - this.pageindex * this.pagenum : 0;
    }
    doRefresh(refresher) {
        window.setTimeout(() => {
            this.pageindex++;
            this.changeindex();
            refresher.complete();
        }, 500);
    }
    /**
    * @name sendMsg
    */
    sendMsg() {
        if (!this.editorMsg.trim()) return;
        // Mock message
        const id = Date.now().toString();
        let newMsg: ChatMessage = {
            messageId: id,
            msgtype: 0,
            userId: this.userId,
            toUserId: this.toUserId,
            time: Date.now(),
            message: this.editorMsg,
            status: 'pending',
            isread: 0
        };
        if (!this.isdiyopen) {
            this.messageInput.setFocus();
        }
        this.pushNewMsg(newMsg);
        this.editorMsg = '';
        this.chatService.sendMsg(newMsg)
            .then(() => {
                let index = this.getMsgIndexById(id);
                if (index !== -1) {
                    this.msgList[index].status = 'success';
                    this.chatService.saveMsgList(this.userId, this.toUserId, this.msgList);
                }
            })
    }

    /**
     * @name pushNewMsg
     * @param msg
     */
    pushNewMsg(msg: ChatMessage) {
        // 判断是否为当前窗口用户 否则不让处理
        if ((msg.userId === this.userId && msg.toUserId === this.toUserId) || (msg.toUserId === this.userId && msg.userId === this.toUserId)) {
            this.msgList.push(msg);
        }
        this.scrollToBottom();
    }

    getMsgIndexById(id: string) {
        return this.msgList.findIndex(e => e.messageId === id)
    }

    scrollToBottom() {
        setTimeout(() => {
            if (this.content.scrollToBottom) {
                this.content.scrollToBottom();
            }
        }, 400)
    }
}
