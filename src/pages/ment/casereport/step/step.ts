import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, Platform } from 'ionic-angular';
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
        eventID: "",
        arguments: [],
        setwho: this.mentservice.chatser.native.UserSession._id
    };
    deptid: string;
    isadd: boolean = false;
    constructor(public navCtrl: NavController, public platform: Platform, public modalCtrl: ModalController, private alertCtrl: AlertController, public navParams: NavParams, public mentservice: MentService) {
        //待接受案件id 待处理定位与法律依据
        this.deptid = navParams.get("deptid");
        this.subdata.eventID = navParams.get("eid");
        if (navParams.get("add")) {
            this.isadd = true;
        }
        if (navParams.get("sid")) {
            //拿到当前步骤id，根据步骤id获取当前步骤参数
            this.mentservice.getargutostep(navParams.get("sid")).subscribe(data_cur => {
                if (!data_cur.json().success) {
                    this.mentservice.chatser.native.alert("抱歉，暂未查到相关步骤");
                    return;
                }
                this.contorl_list = data_cur.json().success;
                //扩充
                for (var i = 0; i < this.contorl_list.length; i++) {
                    this.contorl_list[i].showvalue = "";
                    if (this.contorl_list[i].value.length > 0) {
                        this.contorl_list[i].showvalue = this.contorl_list[i].value[this.contorl_list[i].value.length - 1];
                    }
                    if (this.contorl_list[i].type == "location") {
                        this.contorl_list[i].mapvalue = "";
                        if (this.contorl_list[i].showvalue) {
                            //转换坐标
                            this.getaddress(this.contorl_list[i]);
                        }
                    }
                    if (this.contorl_list[i].type == "time") {
                        if (!this.contorl_list[i].showvalue) {
                            this.contorl_list[i].showvalue = moment(new Date().getTime() + 28800000).utc().format();
                        }
                    }
                }
            });
        }
    }
    //根据经纬度获取地址
    getaddress(model) {
        var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
        });
        geocoder.getAddress(model.showvalue, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                model.mapvalue = result.regeocode.formattedAddress;
                console.log(result);
            }
        });
    }
    //循环添加数据
    xhadd() {
        for (var i = 0; i < this.contorl_list.length; i++) {
            this.subdata.arguments.push({
                arguid: this.contorl_list[i]._id,
                value: this.contorl_list[i].showvalue
            });
        }
    }
    //选择地址
    selectmap(model) {
        console.log(this.contorl_list)
        let profileModal = this.modalCtrl.create('LocationPage', {});
        profileModal.onDidDismiss(res => {
            if (res) {
                model.showvalue = [res.location.lng, res.location.lat];
                model.mapvalue = res.name;
            }
        });
        profileModal.present();
    }
    //选择法律法规
    selectFalv(model) {
        let profileModal = this.modalCtrl.create('falvPage', { deptid: this.deptid });
        profileModal.onDidDismiss(res => {
            if (res) {
                var falv = "";
                for (var i = 0; i < res.length; i++) {
                    var lawname = res[i].lawname;
                    for (var y = 0; y < res[i].lawlist.length; y++) {
                        if (res[i].lawlist[y].checked) {
                            falv += ";" + lawname + res[i].lawlist[y].value;
                        }
                    }
                }
                if (falv) {
                    falv = falv.substr(1);
                }
                model.showvalue = falv;
            }
        });
        profileModal.present();
    }
    alertsuc() {
        let alert = this.alertCtrl.create({
            title: "提示",
            message: "提交成功",
            buttons: [
                {
                    text: "确认",
                    handler: () => {
                        if (this.isadd) {
                            this.navCtrl.setRoot("MentPage");
                        } else {
                            this.navCtrl.pop();
                        }
                    }
                }]
        });
        alert.present();
    }
    //保存参数
    saveclick() {
        this.xhadd();
        this.mentservice.sendeventargument(this.subdata).subscribe(data => {
            this.alertsuc();
        })
    }
    //提交审核，检测参数是否填写完整
    upclick() {
        var issub = true;
        var title = "";
        for (var i = 0; i < this.contorl_list.length; i++) {
            if (!this.contorl_list[i].showvalue) {
                title = this.contorl_list[i].promptvalue;
                issub = false;
                break;
            }
        }
        if (!issub) {
            this.mentservice.chatser.native.alert(title + "没有数据，不能提交审核");
            return;
        }
        this.xhadd();
        this.mentservice.sendeventargumentpush(this.subdata).subscribe(data => {
            this.alertsuc();
        })
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad stepPage');
    }

}
