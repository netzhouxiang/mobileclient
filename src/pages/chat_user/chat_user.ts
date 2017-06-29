import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, TextInput, Events, LoadingController } from 'ionic-angular';
import { ChatService, ChatMessage } from "../../providers/chat-service";
import { Storage } from '@ionic/storage';
import { Utils } from "../../providers/Utils";
import { NativeService } from "../../providers/NativeService";
import { HttpService } from "../../providers/http.service";
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
    isvoice: boolean = false;
    voicestate: number = 0;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public chatService: ChatService,
        public storage: Storage,
        public events: Events,
        private loadingCtrl: LoadingController,
        public native: NativeService,
        public httpser: HttpService,
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
    media_chat: any = null;
    oldtime: number;
    oldurl: string;
    showtip(index) {
        if (index == 1) {
            this.oldtime = Date.now();
            console.log(this.oldtime)
            var src = this.oldtime.toString() + ".wav";
            this.oldurl = src;
            this.media_chat = this.chatService.media.create(src);
            this.media_chat.startRecord();
            this.voicestate = 1;
        } else {
            this.voicestate = 0;
            if (this.media_chat) {
                if (Date.now() >= this.oldtime + 1000) {
                    this.media_chat.stopRecord();
                    //转64base 上传
                    this.native.tobase64(this.oldurl, "").then(database64 => {
                        this.httpser.fileupload({ file64: database64, type: 1 }).then((name) => {
                            if (name) {
                                this.sendMsg(1, name);
                            }
                        })
                    }).catch(err => {
                        console.log(err)
                    })
                } else {
                    this.native.showToast("说话时间太短");
                }
                //上传并发布
            }
        }
    }
    loading = null;
    //发送小视频
    openvoide() {
        this.chatService.media_c.captureVideo({ duration: 30, quality: 5 }).then((file) => {
            let filevideo = file[0];
            var path = "file://" + filevideo.fullPath.substring(7, filevideo.fullPath.lastIndexOf("/"));
            this.loading = this.loadingCtrl.create({
                content: ""
            })
            this.loading.present();
            this.native.tobase64(filevideo.name, path).then(database64 => {
                this.httpser.fileupload({ file64: database64, type: 3, hideloading: true }).then((name) => {
                    this.loading.dismiss();
                    if (name) {
                        this.sendMsg(3, name);
                    }
                })
            }).catch(err => {
                console.log(err)
            })
        });
    }
    changvoice() {
        if (!this.isvoice && this.isdiyopen) {
            this.showpanl();
        }
        this.isvoice = !this.isvoice;
    }
    showpanl() {
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
    //拍摄
    paishe() {
        this.native.getPictureByCamera().then((imageBase64) => {
            //拍摄成功 ， 上传图片
            this.httpser.fileupload({ file64: imageBase64, type: 0 }).then((name) => {
                if (name) {
                    this.sendMsg(2, name);
                }
            })
        });
    }
    //相片
    xiangpian() {
        this.native.getPictureByPhotoLibrary().then((imageBase64) => {
            // 上传图片
            this.httpser.fileupload({ file64: imageBase64, type: 0 }).then((name) => {
                if (name) {
                    this.sendMsg(2, name);
                }
            })
        });
    }
    //播放语音
    playaudio(url) {
        this.chatService.playvoice(this.native.appServer.file + url);
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
    txtSend() {
        if (!this.editorMsg.trim()) return;
        this.sendMsg(0, this.editorMsg.trim());
        if (!this.isdiyopen) {
            this.messageInput.setFocus();
        }
    }
    /**
    * @name sendMsg
    */
    sendMsg(msgtype, message) {
        // Mock message
        const id = Date.now().toString();
        let newMsg: ChatMessage = {
            messageId: id,
            msgtype: msgtype,
            userId: this.userId,
            toUserId: this.toUserId,
            time: Date.now(),
            message: message,
            status: 'pending',
            isread: 0
        };
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
