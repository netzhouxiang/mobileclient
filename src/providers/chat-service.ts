import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MediaPlugin } from '@ionic-native/media';
import 'rxjs/add/operator/toPromise';
import { HttpService } from "../providers/http.service";
import { NativeService } from "../providers/NativeService";
import { MediaCapture } from '@ionic-native/media-capture';
export class ChatMessage {
    messageId: string;
    msgtype: number;//0:文本消息 1:语音 2:图片 3:视频
    userId: string;
    toUserId: string;
    time: number | string;
    message: string;
    status: string;
    isread: number;//0:已读 1:未读  由本人发送的消息 默认已读
}
//最近联系人(最新接受消息或最新发送)
export class ChatLogMessage {
    _id: string; //用户ID
    name: string;//用户昵称
    message: string;//消息内容 如果是文本直接显示 否则转义成类型文字
    count: number;//未读消息数量
}

export class UserInfo {
    userId: string;
    userName: string;
    userImgUrl: string;
}

@Injectable()
export class ChatService {

    constructor(public httpService: HttpService, public events: Events, public storage: Storage, public native: NativeService, public media: MediaPlugin, public media_c: MediaCapture) {

    }
    //清除最新消息标记
    del_logmessage(userid) {
        this.storage.get('char_user_log_' + this.native.UserSession._id).then((val) => {
            if (!val) {
                val = [];
            }
            var list = val;
            for (var i = 0; i < list.length; i++) {
                //存在则清除
                if (list[i]._id == userid) {
                    list[i].count = 0;
                    break;
                }
            }
            this.storage.set('char_user_log_' + this.native.UserSession._id, list);
        });
    }
    //添加最近消息
    add_logmessage(msg: ChatLogMessage) {
        this.storage.get('char_user_log_' + this.native.UserSession._id).then((val) => {
            if (!val) {
                val = [];
            }
            var list = val;
            for (var i = 0; i < list.length; i++) {
                //存在则先删除
                if (list[i]._id == msg._id) {
                    list.splice(i, 1);
                    break;
                }
            }
            list.unshift(msg);
            this.storage.set('char_user_log_' + this.native.UserSession._id, list);
        });
    }
    //读取最近消息
    get_logmessage(): Promise<ChatLogMessage[]> {
        return this.storage.get('char_user_log_' + this.native.UserSession._id).then((val) =>
            val as ChatLogMessage[]
        ).catch(err => Promise.reject(err || 'err'));
    }
    //播放音频
    playvoice(url) {
        this.media.create(url).play();
    }
    //推送
    mockNewMsg(msg) {
        this.events.publish('chat:received', msg);
    }
    //读取缓存聊天记录
    getMsgList(userid, touserid): Promise<ChatMessage[]> {
        return this.storage.get('char_user_' + userid + "_" + touserid).then((val) =>
            val as ChatMessage[]
        ).catch(err => Promise.reject(err || 'err'));
    }
    //保存聊天记录缓存
    saveMsgList(userid, touserid, msglist) {
        this.storage.set('char_user_' + userid + "_" + touserid, msglist);
    }
    //发送消息 并缓存本地
    sendMsg(msg: ChatMessage) {
        var messageObj = {
            text: "",
            video: "",
            voice: "",
            image: ""
        };
        switch (msg.msgtype) {
            case 0:
                messageObj.text = msg.message;
                break;
            case 1:
                messageObj.voice = msg.message;
                break;
            case 2:
                messageObj.image = msg.message;
                break;
            case 3:
                messageObj.video = msg.message;
                break;
        }
        var msgdata = {
            'messageObj': messageObj,
            'senderID': msg.userId,
            'receiverID': msg.toUserId,
            hideloading: true
        }
        return new Promise((resolve, reject) => {
            this.httpService.post("message/sendAMessage", msgdata).subscribe(data => {
                console.log(data);
                resolve(data.json());
            });
        }).then(() => {
            //this.mockNewMsg(msg)
        })
    }
    //通知服务器消息已读
    readMsg(messageID, nomsglist) {
        this.httpService.post("message/readtMessage", {
            messID: messageID,
            hideloading: true
        }).subscribe(data => {
            nomsglist.splice(0, 1);
            if (nomsglist.length > 0) {
                this.MsgCl(nomsglist);
            }
        });
    }
    MsgCl(nomsglist) {
        var msgmodel = nomsglist[0];
        //把查询到的消息添加到缓存 标记未读
        this.getMsgList(this.native.UserSession._id, msgmodel.sender).then(res => {
            if (!res) {
                res = [];
            }
            var msgList = res;
            var msg = {
                messageId: msgmodel._id,
                msgtype: 0,
                userId: msgmodel.sender,
                toUserId: msgmodel.receiver,
                time: Date.now(),
                message: "",
                status: 'success',
                isread: 1//标记未读
            }
            var text = "";
            if (msgmodel.text) {
                msg.msgtype = 0;
                msg.message = msgmodel.text;
                text = msgmodel.text;
            }
            if (msgmodel.image) {
                msg.msgtype = 2;
                msg.message = msgmodel.image;
                text = "图片";
            }
            if (msgmodel.video) {
                msg.msgtype = 3;
                msg.message = msgmodel.video;
                text = "视频";
            }
            if (msgmodel.voice) {
                msg.msgtype = 1;
                msg.message = msgmodel.voice;
                text = "语音";
            }
            msgList.push(msg);
            //缓存消息
            this.saveMsgList(msgmodel.receiver, msgmodel.sender, msgList);
            //推送到聊天窗口
            this.mockNewMsg(msg);
            //推送未读消息
            this.events.publish('chatlist:received', {
                sender: msgmodel.sender,
                text: text
            });
            //推送未读标记
            this.events.publish('tab:readnum', {});
            //ajax通知服务器 消息已本地存储 后台静默标记已读 先不考虑用户换手机情况
            this.readMsg(msgmodel._id, nomsglist);

        });
    }
    //获取当前用户未读消息
    getUserNoRead() {
        this.httpService.post("message/getAllUnreadMessages", { receiverID: this.native.UserSession._id, hideloading: true }).subscribe(data => {
            var nomsglist = data.json();
            if (nomsglist.length > 0) {
                this.MsgCl(nomsglist);
                this.playvoice("file:///android_asset/www/assets/wav/8855.wav");
            }
            //处理完本次消息后，间隔5秒后查询
            setTimeout(() => {
                this.getUserNoRead();
            }, 10 * 1000)
        });
    }
    //获取当前登录用户信息
    getUserInfo(): Promise<UserInfo> {
        let userInfo: UserInfo = {
            userId: this.native.UserSession._id,
            userName: this.native.UserSession.name,
            userImgUrl: this.native.UserSession.images.coverSmall
        };
        return new Promise((resolve, reject) => {
            resolve(userInfo)
        })
    }

}