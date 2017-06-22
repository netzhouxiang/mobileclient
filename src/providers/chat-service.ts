import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';

import 'rxjs/add/operator/toPromise';

export class ChatMessage {
    messageId:string;
    userId: string;
    userName: string;
    userImgUrl: string;
    toUserId: string;
    toUserName: string;
    toUserImgUrl: string;
    time: number|string;
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

  constructor(public http: Http,public events: Events) {
  }

  mockNewMsg(msg){
      setTimeout(() => {
          this.events.publish('chat:received', {
              messageId: Date.now().toString(),
              userId:'210000198410281948',
              userName:'Hancock',
              userImgUrl:'./assets/test_logo.jpg',
              toUserId:'140000198202211138',
              time:Date.now(),
              message:msg.message,
              status:'success'
          }, Date.now());
      },Math.random()*1800)
  }
  //读取缓存聊天记录
  getMsgList(userid,touserid): Promise<ChatMessage[]> {
      const msgListUrl = './assets/mock/msg-list.json';
      return this.http.get(msgListUrl)
          .toPromise()
          .then(response => response.json().array as ChatMessage[])
          .catch(err => Promise.reject(err || 'err'));
  }
  //发送消息 并缓存本地
  sendMsg(msg:ChatMessage){
      return new Promise( (resolve,reject) => {
          setTimeout( () =>{
              resolve(msg)
          },Math.random()*1000)
      }).then(() => {
          this.mockNewMsg(msg)
      })
  }
//获取当前登录用户信息 晚上删除
  getUserInfo(): Promise<UserInfo> {
      let userInfo:UserInfo = {
          userId:'140000198202211138',
          userName:'Luff',
          userImgUrl:'./assets/test_logo.jpg'
      };
      return new Promise((resolve,reject) => {
          resolve(userInfo)
      })
  }

}