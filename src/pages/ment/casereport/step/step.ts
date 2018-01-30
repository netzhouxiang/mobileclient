import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, Platform, ActionSheetController } from 'ionic-angular';
import { MentService } from "../../ment.service";
import moment from 'moment';
declare var AMap, AMapUI;
@IonicPage()
@Component({
    selector: 'page-step',
    templateUrl: 'step.html',
})
export class stepPage {
    contorl_list = [];
    map: any;//地图对象
    subdata = {
        event_id: "",
        step_id: "",
        list: [],
        update_user_id: this.mentservice.chatser.native.UserSession._id,
        auto: '0'
    };
    ajax_model = {
        event_id: '', step_id: '', role_id: '', user_id: '', user_msg: "", status: "", name: "", department: "", type: "", positionvalue: ""
    }
    tomodel = {};
    deptid: string;
    isadd: boolean = false;
    access = false;
    constructor(public navCtrl: NavController, public platform: Platform, public modalCtrl: ModalController, private alertCtrl: AlertController, public navParams: NavParams, public mentservice: MentService, public actionSheetCtrl: ActionSheetController) {

    }
    //点击放大
    showimage(name) {
        let profileModal = this.modalCtrl.create('imagePage', { imgurl: this.mentservice.chatser.native.appServer.file + name });
        profileModal.present();
    }
    //删除相片
    delimage(contorl, name, event) {
        for (var i = 0; i < contorl.updateRecord.length; i++) {
            if (contorl.updateRecord[i] == name) {
                contorl.updateRecord.splice(i, 1);
                //暂不做ajax服务器删除
                break;
            }
        }
        event.stopPropagation();
    }
    //弹出选择图片或拍照
    showimagebutton(contorl) {
        let actionSheet = this.actionSheetCtrl.create({
            title: '请选择',
            buttons: [
                {
                    text: '上传图片',
                    handler: () => {
                        this.mentservice.chatser.native.getPictureByPhotoLibrary().then((imageBase64) => {
                            // 上传图片
                            this.mentservice.chatser.httpService.fileupload({ FileData: imageBase64, type: 1, filetype: 'jpg' }).then((name) => {
                                if (name) {
                                    contorl.updateRecord.push(name);
                                }
                            })
                        });
                    }
                }, {
                    text: '拍照',
                    handler: () => {
                        this.mentservice.chatser.native.getPictureByCamera().then((imageBase64) => {
                            //拍摄成功 ， 上传图片
                            this.mentservice.chatser.httpService.fileupload({ FileData: imageBase64, type: 1, filetype: 'jpg' }).then((name) => {
                                if (name) {
                                    contorl.updateRecord.push(name);
                                }
                            })
                        });
                    }
                }, {
                    text: '取消',
                    role: '取消',
                    handler: () => {
                    }
                }
            ]
        });
        actionSheet.present();
    }
    //根据经纬度获取地址
    getaddress(model) {
        var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
        });
        geocoder.getAddress(JSON.parse(model.showvalue), function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                model.mapvalue = result.regeocode.formattedAddress;
            }
        });
    }
    //循环添加数据
    xhadd() {
        for (var i = 0; i < this.contorl_list.length; i++) {
            if (this.contorl_list[i].type == "image") {
                this.subdata.list.push({
                    para_type: this.contorl_list[i].para_type,
                    para_name: this.contorl_list[i].para_name,
                    para_value: this.contorl_list[i].updateRecord.join()
                });
            } else {
                this.subdata.list.push({
                    para_type: this.contorl_list[i].para_type,
                    para_name: this.contorl_list[i].para_name,
                    para_value: this.contorl_list[i].showvalue
                });
            }
        }
    }
    //选择地址
    selectmap(model) {
        if (this.access) {
            return;
        }
        let profileModal = this.modalCtrl.create('LocationPage', {});
        profileModal.onDidDismiss(res => {
            if (res) {
                model.showvalue = JSON.stringify([res.location.lng, res.location.lat]);
                model.mapvalue = res.name;
            }
        });
        profileModal.present();
    }
    //选择用户
    selectuser(model) {
        if (this.access) {
            return;
        }
        let profileModal = this.modalCtrl.create('SelectUserPage', { users: model.para_value });
        profileModal.onDidDismiss(res => {
            if (res) {
                var user = "";
                var user_id = "";
                for (var i = 0; i < res.length; i++) {
                    user += "," + res[i].name;
                    user_id += "," + res[i]._id;
                }
                if (user) {
                    user = user.substr(1);
                }
                if (user_id) {
                    user_id = user_id.substr(1);
                }
                model.para_value = user_id;
                model.showvalue = user;
            }
        });
        profileModal.present();
    }
    alertsuc(msg: string) {
        let alert = this.alertCtrl.create({
            title: "提示",
            message: msg,
            buttons: [
                {
                    text: "确认",
                    handler: () => {
                        if (this.isadd || this.access) {
                            this.navCtrl.setRoot("MentPage");
                        } else {
                            this.navCtrl.pop();
                        }
                    }
                }]
        });
        alert.present();
    }
    verify(i) {
        if (!this.ajax_model.user_msg) {
            this.mentservice.chatser.native.alert("请输入" + (i ? "同意" : "拒绝") + "的原因");
            return false;
        }
        this.ajax_model.status = "0";
        if (i) {
            this.ajax_model.status = "2";
        }
        this.mentservice.sendstepgo(this.ajax_model).subscribe(data => {
            this.mentservice.chatser.native.alert("操作成功");
            this.navCtrl.setRoot("MentPage");
        });
    }
    //保存参数
    saveclick() {
        this.xhadd();
        this.subdata.auto = '0';
        this.mentservice.sendeventargument({
            event_id: this.subdata.event_id,
            step_id: this.subdata.step_id,
            list: JSON.stringify(this.subdata.list),
            update_user_id: this.mentservice.chatser.native.UserSession._id,
            auto: this.subdata.auto
        }).subscribe(data => {
            this.alertsuc('保存成功');
        })
    }
    //提交审核，检测参数是否填写完整
    upclick() {
        var issub = true;
        var title = "";
        for (var i = 0; i < this.contorl_list.length; i++) {
            if (this.contorl_list[i].type == "image") {
                if (this.contorl_list[i].updateRecord.length == 0) {
                    title = this.contorl_list[i].para_name;
                    issub = false;
                    break;
                }
            } else {
                if (!this.contorl_list[i].showvalue) {
                    title = this.contorl_list[i].para_name;
                    issub = false;
                    break;
                }
            }
        }
        if (!issub) {
            this.mentservice.chatser.native.alert(title + "没有数据，不能提交审核");
            return;
        }
        this.xhadd();
        this.subdata.auto = '1';
        this.mentservice.sendeventargument({
            event_id: this.subdata.event_id,
            step_id: this.subdata.step_id,
            list: JSON.stringify(this.subdata.list),
            update_user_id: this.mentservice.chatser.native.UserSession._id,
            auto: this.subdata.auto
        }).subscribe(data => {
            this.alertsuc('提交成功');
        })
    }
    ionViewDidLoad() {
        //待接受案件id 待处理定位与法律依据
        this.subdata.event_id = this.navParams.get("eid");
        if (this.navParams.get("add")) {
            this.isadd = true;
        }
        if (this.navParams.get("access")) {
            this.access = true;
            this.mentservice.EcevtModel(this.subdata.event_id).subscribe(data => {
                var model = data.json();
                if (model.code != 200) {
                    this.mentservice.chatser.native.alert("抱歉，暂未查到相关案件");
                    return;
                }
                this.ajax_model.name = model.info.name;
                this.ajax_model.department = model.info.deptname;
                this.ajax_model.type = model.info.typename;
                this.ajax_model.positionvalue = model.info.address;
            });
        }
        //拿到当前步骤id，根据步骤id获取当前步骤参数 
        this.mentservice.getcurrentstep(this.subdata.event_id).subscribe(data_cur => {
            var model = data_cur.json();
            if (model.code != 200) {
                this.mentservice.chatser.native.alert("抱歉，暂未查到相关步骤");
                return;
            }
            this.subdata.event_id = model.info.event_id;
            this.subdata.step_id = model.info.step_id;
            this.contorl_list = model.info.steps;
            //扩充
            for (var i = 0; i < this.contorl_list.length; i++) {
                this.contorl_list[i].showvalue = "";
                if (this.contorl_list[i].para_value) {
                    this.contorl_list[i].showvalue = this.contorl_list[i].para_value;
                }
                if (this.contorl_list[i].para_type == 7) {
                    this.contorl_list[i].mapvalue = "";
                    if (this.contorl_list[i].showvalue) {
                        //转换坐标
                        this.getaddress(this.contorl_list[i]);
                    } else {
                        //如果没有数据，获取默认地址
                        this.contorl_list[i].mapvalue = this.mentservice.location.name;
                        this.contorl_list[i].showvalue = JSON.stringify(this.mentservice.location.loc)
                    }
                }
                if (this.contorl_list[i].para_type == 5) {
                    var user = "";
                    //根据用户ID，找出对应用户昵称
                    var user_arr = this.contorl_list[i].para_value.split(",");
                    for (var y = 0; y < user_arr.length; y++) {
                        this.mentservice.chatser.native.UserList.forEach(item => {
                            if (item._id == parseInt(user_arr[y])) {
                                user += "," + item.name;
                                return false;
                            }
                        });
                    }
                    if (user) {
                        user = user.substr(1);
                    }
                    this.contorl_list[i].showvalue = user;
                }
                if (this.contorl_list[i].para_type == 2) {
                    if (!this.contorl_list[i].showvalue) {
                        this.contorl_list[i].showvalue = moment(new Date().getTime() + 28800000).utc().format();
                    }
                    // else {
                    //     this.contorl_list[i].showvalue = moment(this.contorl_list[i].para_value + 28800000).utc().format();
                    // }
                }
                if (this.contorl_list[i].para_type == 3) {
                    //文件名称，变数组
                    var img_arr = this.contorl_list[i].para_value.split(",");
                    this.contorl_list[i].updateRecord = img_arr;
                }
            }
        });
    }
}
