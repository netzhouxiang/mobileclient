import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { NativeService } from "../../../providers/NativeService";

/**
 * Generated class for the RegisttipPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-addqun',
    templateUrl: 'addqun.html',
})
export class AddqunPage {
    ajaxdata = {
        name: '',
        desc: ''
    }
    constructor(public navCtrl: NavController, public modalCtrl: ModalController, public navParams: NavParams, public viewCtrl: ViewController, public nativeService: NativeService) {

    }
    dismiss() {
        this.viewCtrl.dismiss(0);
    }
    addclick() {
        if (!this.ajaxdata.name) {
            this.nativeService.alert("请输入讨论组名称");
            return false;
        }
        if (!this.ajaxdata.desc) {
            this.nativeService.alert("请输入讨论组简介");
            return false;
        }
        this.nativeService.showLoading();
        (<any>window).JMessage.createGroup({ name: this.ajaxdata.name, desc: this.ajaxdata.desc },
            (groupId) => {  // groupId: 新创建的群组 ID
                // do something.
                this.nativeService.hideLoading();
                this.nativeService.alert("创建成功");
                this.viewCtrl.dismiss(1);
            }, (error) => {
                this.nativeService.hideLoading();
                this.nativeService.alert("创建失败");
            });
    }
}
