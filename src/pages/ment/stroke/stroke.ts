import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Tabs } from 'ionic-angular';
import { NativeService } from "../../../providers/NativeService";
import { HttpService } from "../../../providers/http.service";
/**
 * Generated class for the StrokePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-stroke',
    templateUrl: 'stroke.html',
})
export class StrokePage {

    constructor(public navCtrl: NavController, public navParams: NavParams, public native: NativeService, private httpService: HttpService, public events: Events, public tab: Tabs) {
        this.getpersonEvent();
    }

    ionViewDidLoad() {

        console.log('ionViewDidLoad StrokePage');
    }
    strokeList = new Array();//事件列表
    getpersonEvent() {//获取今日日程
        //获取所有的网格区域
        this.httpService.post("maproute/getspotarea").subscribe(data => {
            let arealist = data.json().success;
            let requestInfo = {
                url: "mobilegrid/getpersonworkregion",
                personID: this.native.UserSession._id
            }
            this.httpService.post(requestInfo.url, requestInfo).subscribe(data => {
                try {
                    let res = data.json();
                    if (res.error) {
                        this.native.showToast(res.error.error);
                    } else {
                        this.strokeList = res.success;
                        //获取区域数据
                        for (var i = 0; i < this.strokeList.length; i++) {
                            this.strokeList[i].quyumodel = null;
                            for (var y = 0; y < arealist.length; y++) {
                                if (arealist[y]._id == this.strokeList[i].areaID) {
                                    this.strokeList[i].quyumodel = arealist[y];
                                    break;
                                }
                            }
                        }
                    }
                } catch (error) {
                    this.native.showToast(error);
                }
            }, err => {
                this.native.showToast(err);
            });
        });

    }
    //排除星期
    getweek(time) {
        let gxx = time.split(" ");
        let week = "";
        switch (gxx[0]) {
            case "1":
                week = "周一";
                break;
            case "2":
                week = "周二";
                break;
            case "3":
                week = "周三";
                break;
            case "4":
                week = "周四";
                break;
            case "5":
                week = "周五";
                break;
            case "6":
                week = "周六";
                break;
            case "7":
                week = "周日";
                break;
        }
        return week + "(" + gxx[1];
    }
    getweek2(time) {
        return time.split(" ")[1] + ")";
    }
    HomePage: any = 'HomePage';
    goOtherPage(obj) {//去其他页面
        //回首页地图对接,定位区域地址
        this.events.publish('home:quyudw', obj);
        this.navCtrl.pop();
        this.tab.select(0);
        
    }
}
