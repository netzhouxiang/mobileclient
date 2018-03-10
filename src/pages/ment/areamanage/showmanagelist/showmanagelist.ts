import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Tabs } from 'ionic-angular';
import { NativeService } from "../../../../providers/NativeService";
import { HttpService } from "../../../../providers/http.service";
import { MapService } from "../../../home/map-service";
/**
 * Generated class for the StrokePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-stroke',
    templateUrl: 'showmanagelist.html',
})
export class showmanagelist {

    constructor(public manageCtrl: NavController, public navParams: NavParams, public mapService: MapService, public native: NativeService, private httpService: HttpService, public events: Events, public tab: Tabs) {
        console.log('载入showmanagelist.ts')
        var user_id=this.navParams.data.user// 接收路由切换传递过来的指
        this.getpersonEvent(user_id);
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad StrokePage');
    }

    strokeList = new Array();//事件列表
    allarea;//所有网格区域
    UserList;//所有用户集合
    getAreaName(id) {//根据区域id获取其中文名称
        var isid;
        this.allarea.forEach(element => {
            if(id == element._id){
                isid=element.name;
        console.log(id+' ' + isid)
                return;
            }
        });
        return isid;
    };
    getUserName(id){//根据用户id获取其中文名称
        var isid;
        this.native.UserList.forEach(element => {
            if(id == element._id){
                isid=element.name;
                return;
            }
        });
        return isid;
    }
    getpersonEvent(user){
        let requestInfo = {
            url: "areaperson/GetpersonlogsList",
            user_id:user
        }
        this.httpService.post(requestInfo.url,{user_id:requestInfo.user_id}).subscribe(data => {
            try {
                let res = data.json();
                if (res.code == 200) {
                    this.strokeList = res.info.list;
                    console.log(this.strokeList)
                    this.strokeList.forEach(list=>{
                        list.recorder_name=this.getUserName(list.recorder_id)
                    })
                } else {
                    this.native.showToast(res.info);
                }
            } catch (error) {
                this.native.showToast(error);
            }
        }, err => { });
    };

    goOtherPage(pagename,dat) {//去其他页面
        //回首页地图对接,定位区域地址
        if(!pagename){
            this.native.alert('开发中...');
              return
          }
        console.log(pagename)
        this.manageCtrl.push(pagename,dat);
        // this.manageCtrl.pop();
        // this.tab.select(0);

    }
}
