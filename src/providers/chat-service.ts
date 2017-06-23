import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/toPromise';
import { HttpService } from "../providers/http.service";

export class ChatMessage {
    messageId: string;
    userId: string;
    userName: string;
    userImgUrl: string;
    toUserId: string;
    toUserName: string;
    toUserImgUrl: string;
    time: number | string;
    message: string;
    status: string;
}

export class UserInfo {
    userId: string;
    userName: string;
    userImgUrl: string;
}

@Injectable()
export class ChatService {

    constructor(public http: HttpService, public events: Events, public storage: Storage) {
    }

    mockNewMsg(msg) {
        setTimeout(() => {
            this.events.publish('chat:received', {
                messageId: Date.now().toString(),
                userId: '210000198410281948',
                userName: 'Hancock',
                userImgUrl: './assets/test_logo.jpg',
                toUserId: '140000198202211138',
                time: Date.now(),
                message: msg.message,
                status: 'success'
            }, Date.now());
        }, Math.random() * 1800)
    }
    //读取缓存聊天记录
    getMsgList(userid, touserid): Promise<ChatMessage[]> {
        return this.storage.get('char_user_' + userid + "_" + touserid).then((val) =>
            val.json().array as ChatMessage[]
        ).catch(err => Promise.reject(err || 'err'));
    }
    //发送消息 并缓存本地
    sendMsg(msg: ChatMessage) {
        //存储本地缓存
        this.getMsgList(msg.userId, msg.toUserId)
            .then(res => {
                var msglist = res;
                //添加消息到缓存
                msglist.push(msg);
                //存储
                this.storage.set('char_user_' + msg.userId + "_" + msg.toUserId, JSON.stringify(msglist));
            })
            .catch(err => {
                console.log(err)
            });

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(msg)
            }, Math.random() * 1000)
        }).then(() => {
            this.mockNewMsg(msg)
        })
    }
    //获取当前登录用户信息 晚上删除
    getUserInfo(): Promise<UserInfo> {
        let userInfo: UserInfo = {
            userId: '140000198202211138',
            userName: 'Luff',
            userImgUrl: './assets/test_logo.jpg'
        };
        return new Promise((resolve, reject) => {
            resolve(userInfo)
        })
    }

}