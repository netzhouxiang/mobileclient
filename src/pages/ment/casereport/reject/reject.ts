import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { MentService } from "../../ment.service";
/**
 * Generated class for the StrokePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var AMap, AMapUI;
@IonicPage()
@Component({
    selector: 'page-reject',
    templateUrl: 'reject.html',
})
export class rejectPage {
    anjian_model = null;
    step_model = null;
    map: any;//地图对象
    showbtn = false;
    contorl_list = [];
    ajax_model = {
        stepID: '', person: '', personTitle: '', text: '', eventID: ""
    };
    constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public mentservice: MentService) {
        this.anjian_model = this.navParams.data;
        //获取部门
        this.mentservice.getAllDepartments().subscribe(data => {
            for (var i = 0; i < data.json().success.length; i++) {
                if (data.json().success[i]._id == this.anjian_model.department) {
                    this.anjian_model.department = data.json().success[i].name;
                    break;
                }
            }
        });
        this.ajax_model.eventID = this.anjian_model._id;
        this.ajax_model.person = this.mentservice.chatser.native.UserSession._id;

        this.anjian_model.positionvalue = "获取位置中";
        this.getaddress(this.anjian_model, 1);
    }
    //根据经纬度获取地址
    getaddress(model, type) {
        try {
            var geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all"
            });
            geocoder.getAddress(type ? model.position : model.value, function (status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    if (type) {
                        model.positionvalue = result.regeocode.formattedAddress;
                    } else {
                        model.showvalue = result.regeocode.formattedAddress;
                    }
                }
            });
        } catch (error) {
            this.mentservice.chatser.native.showToast("地点参数错误");
            this.navCtrl.pop();
        }
    }
    //查看图片
    showimage(contorl) {
        if (contorl.value.length) {
            let name = contorl.value[contorl.value.length - 1];
            let profileModal = this.modalCtrl.create('imagePage', { imgurl: this.mentservice.chatser.native.appServer.file + name });
            profileModal.present();
        } else {
            this.mentservice.chatser.native.alert("没有上传图片");
        }
    }
    ionViewDidLoad() {
        //获取当前案件待审核的步骤
        this.mentservice.getcurrentexaminestep(this.anjian_model._id).subscribe(data => {
            if (!data.json().success.length) {
                this.navCtrl.pop();
                this.mentservice.chatser.native.showToast("未查到待审核步骤")
                return false;
            }
            this.step_model = data.json().success[data.json().success.length - 1];
            this.ajax_model.stepID = this.step_model._id;
            //根据步骤 获取参数
            //拿到当前步骤id，根据步骤id获取当前步骤参数 
            this.mentservice.getargutostep(this.step_model._id).subscribe(data_cur => {
                if (!data_cur.json().success) {
                    this.mentservice.chatser.native.showToast("未查到相关步骤");
                    this.navCtrl.pop();
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
                        if (this.contorl_list[i].showvalue) {
                            this.getaddress(this.contorl_list[i], 0);
                        }
                    }
                    if (this.contorl_list[i].type == "image") {
                        this.contorl_list[i].showvalue = "查看图片";
                    }
                }
                this.showbtn = true;
            });
        });
    }
    verify(i) {
        if (!this.ajax_model.text) {
            this.mentservice.chatser.native.alert("请输入" + (i ? "同意" : "拒绝") + "的原因");
            return false;
        }
        if (i) {
            this.mentservice.sendstepgo(this.ajax_model).subscribe(data => {
                this.mentservice.chatser.native.alert("操作成功");
                this.navCtrl.setRoot("MentPage");
            });
        } else {
            this.mentservice.sendeventargbackoff(this.ajax_model).subscribe(data => {
                this.mentservice.chatser.native.alert("操作成功");
                this.navCtrl.setRoot("MentPage");
            });
        }
    }

}
