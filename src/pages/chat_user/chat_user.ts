import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, TextInput, Events } from 'ionic-angular';
import { ChatService, ChatMessage } from "../../providers/chat-service";
import { Storage } from '@ionic/storage';
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
    isdiyopen: boolean = false;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public chatService: ChatService,
        public storage: Storage,
        public events: Events,
        public ref: ChangeDetectorRef) {
        this.toUserId = navParams.data._id = "210000198410281948";
        this.toUserName = navParams.data.name;
        this.toUserImg = "./assets/img/test_logo.jpg";
        // Get mock user information
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
        // unsubscribe
        this.events.unsubscribe('chat:received')

    }

    ionViewDidEnter() {
        //get message list
        this.getMsg()
            .then(() => {
                this.scrollToBottom()
            });

        // Subscribe to received  new message events
        this.events.subscribe('chat:received', (msg, time) => {
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
        // Get mock message list
        return this.chatService
            .getMsgList(this.userId, this.toUserId)
            .then(res => {
                this.msgList = res;
            })
            .catch(err => {
                console.log(err)
            })
    }

    /**
    * @name sendMsg
    */
    sendMsg() {

        if (!this.editorMsg.trim()) return;

        // Mock message
        const id = Date.now().toString();
        let newMsg: ChatMessage = {
            messageId: Date.now().toString(),
            userId: this.userId,
            userName: this.userName,
            userImgUrl: this.userImgUrl,
            toUserId: this.toUserId,
            toUserImgUrl: "",
            toUserName: "",
            time: Date.now(),
            message: this.editorMsg,
            status: 'pending'
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
                }
            })
    }

    /**
     * @name pushNewMsg
     * @param msg
     */
    pushNewMsg(msg: ChatMessage) {
        // Verify user relationships
        if (msg.userId === this.userId && msg.toUserId === this.toUserId) {
            this.msgList.push(msg);
        } else if (msg.toUserId === this.userId && msg.userId === this.toUserId) {
            this.msgList.push(msg);
        }
        this.storage.set('char_user_' + msg.userId + "_" + msg.toUserId, this.msgList);
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
