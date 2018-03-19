import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';
import { NativeService } from "../../../providers/NativeService";
import { HttpService } from "../../../providers/http.service";
import { MentService } from "../ment.service";
/**
 * Generated class for the StrokePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-areamanage',
    templateUrl: 'areamanage.html',
})

export class areaManage {

    constructor(public manageCtrl: NavController, public navParams: NavParams,public native: NativeService, private httpService: HttpService,public mentservice: MentService,public modalCtrl: ModalController) {
        console.log('载入areamanage.ts')
        this.native.showLoading();//显示加载条
        this.getpersonEvent();
    }
    searchKey:string = "";
    items = [];
    doRefresh(refresher) {// 做刷新处理
        this.getpersonEvent();
        setTimeout(() => {
            refresher.complete();
        }, 3000);
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad StrokePage');
    }
    strokeList = new Array();//事件列表
    getUserName(id) {
        var isid;
        this.native.UserList.forEach(element => {
            if(id == element._id){
                isid=element.name;
                return;
            }
        });
        return isid;
    };
    onsearchInput(ev:any){ // 搜索内容
  
      // set val to the value of the searchbar
      let val = ev.target.value;
      console.log(val)
  
      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.items = this.strokeList.filter((item) => {
          return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
    }
    showChat(name) {// 按名字搜索用户
        return name.indexOf(this.searchKey) > -1;
    }
    //点击放大
    showimage(name) {
        let profileModal = this.modalCtrl.create('imagePage', { imgurl: this.mentservice.chatser.native.appServer.file + 'images/other/' + name });
        profileModal.present();
    }
    getpersonEvent() {
            //获取所有网格区域
            let requestInfo = {
                url: "personfacilities/GetFacilitiesForId",
                user_id: this.native.UserSession._id
            }
            this.httpService.post(requestInfo.url,{user_id:requestInfo.user_id}).subscribe(data => {
                try {
                    let res = data.json();
                    if (res.code == 200) {
                        this.strokeList = res.info.list;
                        this.strokeList.forEach(list=>{
                            list.recorder_name=this.getUserName(list.user_id)
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
        this.manageCtrl.push(pagename,dat);
        // this.manageCtrl.pop();
        // this.tab.select(0);

    };
    gofavorite(type, phone, event) {
        location.href = type == 0 ? "sms:" : "tel:" + phone;
        console.log(type, phone)
    }
}
