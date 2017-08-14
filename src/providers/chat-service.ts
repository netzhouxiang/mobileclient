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
    isplay: boolean;
}
//特殊消息
export class ChatTsMessage {
    abnormalID: string;//消息ID
    msgid: string;//消息ID
    _id: string;//发送人ID
    name: string; //发送人名称
    message: string;//发送人内容
    starttime: string; //开始时间
    endtime: string;//结束时间
    type: string //0:请假 1：换班
    status: string;//0:申请 1:结果
    cl: string;//0:未读 1:已读
    cljg: string;
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
    public qjred: number = 0;
    public hbred: number = 0;
    public deptlist = [];
    public ispaly = false;//表示是否播放语音提醒
    constructor(public httpService: HttpService, public events: Events, public storage: Storage, public native: NativeService, public media: MediaPlugin, public media_c: MediaCapture) {

    }
    //更新请假换班数量
    changred() {
        this.qjred = 0;
        this.hbred = 0;
        return this.getMsgListTs().then(res => {
            if (!res) {
                res = [];
            }

            var msglistTs = res;
            for (var i = 0; i < msglistTs.length; i++) {
                if (msglistTs[i].type == "0" && msglistTs[i].cl == "0") {
                    this.qjred++;
                }
                if (msglistTs[i].type == "1" && msglistTs[i].cl == "0") {
                    this.hbred++;
                }
            }
        });
    }
    //标记已读
    changeread(msgid, ok) {
        return this.getMsgListTs().then(res => {
            if (!res) {
                res = [];
            }
            var msglistTs = res;
            for (var i = 0; i < msglistTs.length; i++) {
                if (msglistTs[i].msgid == msgid) {
                    msglistTs[i].cl = "1";
                    msglistTs[i].cljg = ok;
                    break;
                }
            }
            this.saveMsgListTs(msglistTs);
        });
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
    playvoice(url, msg) {
        this.media.create(url, function () {
        }, function () {
            if (msg) {
                msg.isplay = false;
            }
        }).play();
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
    //读取缓存特殊聊天记录
    getMsgListTs(): Promise<ChatTsMessage[]> {
        return this.storage.get('char_user_ts_' + this.native.UserSession._id).then((val) =>
            val as ChatTsMessage[]
        ).catch(err => Promise.reject(err || 'err'));
    }
    //保存聊天特殊记录缓存
    saveMsgListTs(msglist) {
        this.storage.set('char_user_ts_' + this.native.UserSession._id, msglist);
    }
    //群发消息 后台静默发送
    qunsendMsg(receiverInfo, messageObj) {
        var msgdata = {
            'messageObj': messageObj,
            'senderID': this.native.UserSession._id,
            'type': "broadcast",
            'receiverInfo': receiverInfo,
            "receiverType": "persons",
            hideloading: true
        }
       
        //for (var i = 0; i < receiverInfo.length; i++) {
        //    msgdata["receiverInfo[" + i + "]"] = receiverInfo[i];
        //}
        this.httpService.post("message/sendBroadcast", msgdata).subscribe(data => {
            console.log(data);
        });
    }
    //发送的异常消息缓存，等待接受结果，收到后添加到异常消息记录缓存里，删除本缓存里的数据
    getMsgListTsSend(): Promise<string[]> {
        return this.storage.get('char_user_ts_send_' + this.native.UserSession._id).then((val) =>
            val as string[]
        ).catch(err => Promise.reject(err || 'err'));
    }
    saveMsgListTs_Send(msglist) {
        this.storage.set('char_user_ts_send_' + this.native.UserSession._id, msglist);
    }
    //循环检测缓存KEY，有没有结果
    ajaxTs_Send() {
        this.getMsgListTsSend().then(resx => {
            if (!resx) {
                resx = [];
            }
            if (resx.length > 0) {
                var res_s = resx.concat();
                this.httpService.post("message/getAbnormaldMessageFeedback", { senderID: this.native.UserSession._id, hideloading: true }).subscribe(data => {
                    var list = data.json();
                    if (list) {
                        //请假或者换班消息
                        this.getMsgListTs().then(res => {
                            if (!res) {
                                res = [];
                            }
                            var msglistTs = res;
                            var _name = "默认用户";
                            var istz = false;
                            for (var i = 0; i < list.length; i++) {
                                var msgmodel = list[i];
                                for (var y = 0; y < res_s.length; y++) {
                                    if (msgmodel.abnormalID == res_s[y]) {
                                        istz = true;
                                        //存在 表示已经得到回复了
                                        resx.splice(y, 1);
                                        //获取姓名
                                        var iscz = false;
                                        this.xhFun(function (user, _self) {
                                            if (user.person._id == msgmodel.receiver) {
                                                iscz = true;
                                                _name = user.person.name;
                                                return true;
                                            }
                                            return false;
                                        });
                                        //二期优化
                                        if (!iscz) {
                                            let requestInfo = {
                                                url: "personadminroute/getUserInfoById",
                                                personID: msgmodel.receiver,
                                                hideloading: true
                                            }
                                            this.httpService.post(requestInfo.url, requestInfo).subscribe(
                                                data => {
                                                    var user = data.json().success;
                                                    var msg_ts = {
                                                        abnormalID: msgmodel.abnormalID,
                                                        msgid: msgmodel._id + "hf",
                                                        _id: msgmodel.receiver,
                                                        name: user.name,
                                                        message: msgmodel.text,
                                                        starttime: msgmodel.abnormalStartTime,
                                                        endtime: msgmodel.abnormalEndTime,
                                                        type: (msgmodel.type == "takeoff" ? "0" : "1"),
                                                        status: msgmodel.status,
                                                        cl: "0",
                                                        cljg: msgmodel.abnormaldecision == "approve" ? "同意" : "拒绝"
                                                    };
                                                    //向前插入
                                                    msglistTs.unshift(msg_ts);
                                                    //缓存消息
                                                    this.saveMsgListTs(msglistTs);
                                                    //推送未读标记
                                                    this.events.publish('tab:readnum_per', 1);
                                                }
                                            );
                                        } else {
                                            var msg_ts = {
                                                abnormalID: msgmodel.abnormalID,
                                                msgid: msgmodel._id + "hf",
                                                _id: msgmodel.receiver,
                                                name: _name,
                                                message: msgmodel.text,
                                                starttime: msgmodel.abnormalStartTime,
                                                endtime: msgmodel.abnormalEndTime,
                                                type: (msgmodel.type == "takeoff" ? "0" : "1"),
                                                status: msgmodel.status,
                                                cl: "0",
                                                cljg: msgmodel.abnormaldecision == "approve" ? "同意" : "拒绝"
                                            };
                                            //向前插入
                                            msglistTs.unshift(msg_ts);
                                            //缓存消息
                                            this.saveMsgListTs(msglistTs);
                                            //推送未读标记
                                            this.events.publish('tab:readnum_per', 1);
                                        }
                                    }
                                }
                            }
                            if (istz) {
                                this.playvoice("file:///android_asset/www/assets/wav/8855.wav", "");
                            }
                            //保存更新
                            this.saveMsgListTs_Send(resx);
                            //10秒后再执行
                            setTimeout(() => {
                                this.ajaxTs_Send();
                            }, 10 * 1000)
                        });
                    } else {
                        //5秒后 再执行
                        setTimeout(() => {
                            this.ajaxTs_Send();
                        }, 5 * 1000)
                    }
                });
            } else {
                //5秒后 再执行
                setTimeout(() => {
                    this.ajaxTs_Send();
                }, 5 * 1000)
            }
        });

    }
    //发送异常消息
    sendAbnormaMsg(message, type, stime, etime, receiverType, receiverInfo) {
        console.log(this.native.UserSession)
        var msgdata = null;
        if (type == "shift") {
            msgdata = {
                senderID: this.native.UserSession._id,
                type: type,//消息类型
                abnormalStartTime: stime,//开始时间
                abnormalEndTime: etime,//结束时间
                abnormalShiftPersonId: receiverInfo,//换班接受人ID
                receiverInfo: receiverInfo,//接受ID
                receiverType: receiverType,//发送类型
                senderTitle: "",
                hideloading: true
            }
            this.httpService.post("message/sendAbnormalMessage", msgdata).subscribe(data => {
                var cur_m = data.json();
                if (cur_m) {
                    this.getMsgListTsSend().then(res => {
                        if (!res) {
                            res = [];
                        }
                        res.unshift(cur_m.abnormalID);
                        this.saveMsgListTs_Send(res);
                    });
                }
            });
        } else {
            msgdata = {
                "messageObj": {
                    text: message
                },
                senderID: this.native.UserSession._id,
                type: type,//消息类型
                abnormalStartTime: stime,//开始时间
                abnormalEndTime: etime,//结束时间
                abnormalShiftPersonId: receiverInfo,//换班接受人ID
                receiverInfo: receiverInfo,//接受ID
                receiverType: receiverType,//发送类型
                senderTitle: "",
                hideloading: true
            }
        }
        this.httpService.post("message/sendAbnormalMessage", msgdata).subscribe(data => {
            var cur_m = data.json();
            if (cur_m) {
                this.getMsgListTsSend().then(res => {
                    if (!res) {
                        res = [];
                    }
                    res.unshift(cur_m.abnormalID);
                    this.saveMsgListTs_Send(res);
                });
            }
        });
    }
    //发送消息 并缓存本地
    sendMsg(msg: ChatMessage, name: string) {
        var messageObj = {
            text: "",
            video: "",
            voice: "",
            image: ""
        };
        var text = msg.message;
        switch (msg.msgtype) {
            case 0:
                messageObj.text = msg.message;
                break;
            case 1:
                messageObj.voice = msg.message;
                text = "语音";
                break;
            case 2:
                messageObj.image = msg.message;
                text = "图片";
                break;
            case 3:
                messageObj.video = msg.message;
                text = "视频";
                break;
        }
        this.add_logmessage({
            _id: msg.toUserId,
            name: name,
            message: text,
            count: 0
        });
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
        switch (msgmodel.type) {
            case "shift":
            case "takeoff":
                {
                    //请假或者换班消息
                    this.getMsgListTs().then(res => {
                        if (!res) {
                            res = [];
                        }
                        var msglistTs = res;
                        var _name = "默认用户";
                        //检查该记录是否存在，存在则不添加
                        var isAdd = true;
                        for (var i = 0; i < msglistTs.length; i++) {
                            var m = msglistTs[i];
                            if (m.msgid == msgmodel._id || m.abnormalID == msgmodel.abnormalID) {
                                //表示存在
                                isAdd = false;
                                break;
                            }
                        }
                        if (isAdd) {
                            this.ispaly = true;
                            //获取姓名
                            this.xhFun(function (user, _self) {
                                if (user.person._id == msgmodel.sender) {
                                    _name = user.person.name;
                                    return true;
                                }
                                return false;
                            });
                            var msg_ts = {
                                abnormalID: msgmodel.abnormalID,
                                msgid: msgmodel._id,
                                _id: msgmodel.sender,
                                name: _name,
                                message: msgmodel.text,
                                starttime: msgmodel.abnormalStartTime,
                                endtime: msgmodel.abnormalEndTime,
                                type: (msgmodel.type == "takeoff" ? "0" : "1"),
                                status: msgmodel.status,
                                cl: "0",
                                cljg: ""
                            };
                            //向前插入
                            msglistTs.unshift(msg_ts);
                            //缓存消息
                            this.saveMsgListTs(msglistTs);
                            //推送未读标记
                            this.events.publish('tab:readnum_per', 1);
                        }
                        nomsglist.splice(0, 1);
                        if (nomsglist.length > 0) {
                            this.MsgCl(nomsglist);
                        }
                    });
                }
                break;
            case "broadcast":
            case "message":
                {
                    this.ispaly = true;
                    var senderid = msgmodel.sender;
                    if (msgmodel.type == "broadcast") {
                        senderid = "000000";
                    }
                    //把查询到的消息添加到缓存 标记未读
                    this.getMsgList(this.native.UserSession._id, senderid).then(res => {
                        if (!res) {
                            res = [];
                        }
                        var msgList = res;
                        var msg = {
                            messageId: msgmodel._id,
                            msgtype: 0,
                            userId: senderid,
                            toUserId: msgmodel.receiver,
                            time: msgmodel.create_date,
                            message: "",
                            status: 'success',
                            isread: 1,//标记未读
                            isplay: false
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
                        this.saveMsgList(msgmodel.receiver, senderid, msgList);
                        //推送到聊天窗口
                        this.mockNewMsg(msg);
                        //查找该用户是不是IM结构中的
                        var iscz = false;
                        for (var a = 0; a < this.deptlist.length; a++) {
                            for (var b = 0; b < this.deptlist[a].persons.length; b++) {
                                if (this.deptlist[a].persons[b].person._id == senderid) {
                                    iscz = true;
                                    var user = this.deptlist[a].persons[b];
                                    var count_m = 1;
                                    if (user.msg) {
                                        count_m = user.msg.count + 1;
                                    } else {
                                        this.deptlist[a].persons[b].msg = {};
                                    }
                                    this.deptlist[a].persons[b].msg = {
                                        count: count_m,
                                        text: text
                                    }
                                    this.add_logmessage({
                                        _id: senderid,
                                        name: user.person.name,
                                        message: text,
                                        count: count_m
                                    });
                                    break;
                                }
                            }
                        }
                        if (!iscz) {
                            let requestInfo = {
                                url: "personadminroute/getUserInfoById",
                                personID: msgmodel.sender,
                                hideloading: true
                            }
                            this.httpService.post(requestInfo.url, requestInfo).subscribe(
                                data => {
                                    var user = data.json().success;
                                    if (senderid == "000000") {
                                        this.add_logmessage({
                                            _id: senderid,
                                            name: "系统通知",
                                            message: user.name + "：" + text,
                                            count: 1
                                        });
                                    } else {
                                        this.add_logmessage({
                                            _id: senderid,
                                            name: user.name,
                                            message: text,
                                            count: 1
                                        });
                                    }
                                    //通知刷新界面
                                    this.events.publish('chatlist:sx', "");
                                }
                            );
                        }
                        //通知刷新界面
                        this.events.publish('chatlist:sx', "");
                        //推送未读标记
                        this.events.publish('tab:readnum', {});
                        //ajax通知服务器 消息已本地存储 后台静默标记已读 先不考虑用户换手机情况
                        this.readMsg(msgmodel._id, nomsglist);
                    });
                }
                break;
        }
    }
    //获取历史消息对象
    getnoreadnum(user) {
        user.msg = {
            text: "",
            count: 0
        };
        this.getMsgList(this.native.UserSession._id, user.person._id).then(res => {
            if (!res) {
                res = [];
            }
            if (user.msg || user.msg.count == 0) {
                var msgList = res;
                var mx = {
                    count: 0,
                    text: ''
                };
                if (msgList.length > 0) {
                    var msgmodel = msgList[msgList.length - 1];
                    switch (msgmodel.msgtype) {
                        case 0:
                            mx.text = msgmodel.message;
                            break;
                        case 1:
                            mx.text = "语音";
                            break;
                        case 2:
                            mx.text = "图片";
                            break;
                        case 3:
                            mx.text = "视频";
                            break;
                    }
                    mx.count = msgmodel.isread;
                    user.msg = mx;
                }
            }
        });
    }
    xhFun(callback) {
        for (var a = 0; a < this.deptlist.length; a++) {
            for (var b = 0; b < this.deptlist[a].persons.length; b++) {
                if (callback(this.deptlist[a].persons[b], this)) {
                    break;
                }
            }
        }
    }
    updatelsmsg() {
        this.xhFun(function (user, _self) {
            _self.getnoreadnum(user);
            return false;
        });
    }
    //加载IM结构
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
                    //读取历史消息
                    this.updatelsmsg();
                    //5秒后开始监听消息
                    setTimeout(() => {
                        this.getUserNoRead();
                    }, 1 * 1000)
                }
            },
            err => console.error(err)
        );
    }
    //获取当前用户未读消息
    getUserNoRead() {
        try {
            //console.log(this.deptlist)
            //检测IM结构数据是否存在 不存在获取
            if (this.deptlist.length == 0) {
                this.ajaxTs_Send();
                var deptlist = this.native.UserSession.departments.concat()
                this.loaduser(deptlist);
            } else {
                this.httpService.post("message/getAllUnreadMessages", { receiverID: this.native.UserSession._id, hideloading: true }).subscribe(data => {
                    var nomsglist = data.json();
                    if (nomsglist.length > 0) {
                        this.MsgCl(nomsglist);
                        if (this.ispaly) {
                            this.playvoice("file:///android_asset/www/assets/wav/8855.wav", "");
                        }
                    }
                    //处理完本次消息后，间隔10秒后查询
                    setTimeout(() => {
                        this.ispaly = false;
                        this.getUserNoRead();
                    }, 10 * 1000)
                });
            }
            //通知tab可以开始读取缓存消息
            this.events.publish('tab:readnum_per', 1);
        } catch (error) {
            alert(error);
        }
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