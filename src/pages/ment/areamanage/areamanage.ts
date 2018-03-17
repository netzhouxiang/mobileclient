import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ActionSheetController } from 'ionic-angular';
import { NativeService } from "../../../providers/NativeService";
import { HttpService } from "../../../providers/http.service";
import { MapService } from "../../home/map-service";
import { LoginService } from '../../login/login-service';
import { Camera, CameraOptions } from '@ionic-native/camera';
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

    constructor(public manageCtrl: NavController, public navParams: NavParams, public mapService: MapService, public native: NativeService, private httpService: HttpService,public actionSheetCtrl: ActionSheetController,private loginser: LoginService, private camera: Camera) {
        console.log('载入areamanage.ts')
        this.native.showLoading();//显示加载条
        this.getpersonEvent();
    }
    searchKey:string = "";
    items = [];
  doRefresh(refresher) {// 做刷新处理
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      this.items = [];
      for (var i = 0; i < 30; i++) {
        this.items.push( this.items.length );
      }
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }
    ionViewDidLoad() {
        console.log('ionViewDidLoad StrokePage');
    }
    strokeList = new Array();//事件列表
    allarea;//所有网格区域
    getAreaName(id) {
        var isid;
        this.allarea.forEach(element => {
            if(id == element._id){
                isid=element.name;
                return;
            }
        });
        return isid;
    };
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
    getpersonEvent() {
                //console.log(this.native.AreaList)
        this.mapService.getspotarea().then(res => {// 获取网格区域
            if (res) {
                this.allarea=res
            //获取所有网格区域
            let requestInfo = {
                url: "areaperson/GetList",
                user_id: this.native.UserSession._id,
                start_index: "0",
                length: 10000
            }
            this.httpService.post(requestInfo.url,{user_id:requestInfo.user_id}).subscribe(data => {
                try {
                    let res = data.json();
                    if (res.code == 200) {
                        this.strokeList = res.info.list;
                        this.strokeList.forEach(list=>{
                            list.area_name=this.getAreaName(list.area_id)
                            list.recorder_name=this.getUserName(list.recorder_id)
                        })
                        console.log(this.strokeList)
                    } else {
                        this.native.showToast(res.info);
                    }
                } catch (error) {
                    this.native.showToast(error);
                }
            }, err => { });
                }
        }, err => {

        })
    };
    content = {
        nativeElement(){
            console.log('aa')
            return 'aa'
        },
        textElement(){

        }
    };
    addPerson(contorl) {
        let actionSheet = this.actionSheetCtrl.create({
            title: '请选择',
            buttons: [
                {
                    text: '身份证识别',
                    handler: () => {
                        let obj={"name":"那黑黑","sex":"男","nation":"汉族","birthday":"1996-02-10","idNum_residence:":"北京市西城区厂物酉侧路人民大会堂西侧路人民大会堂","idNum":"456113199602101132"}
                        this.goOtherPage('addManage',obj)
                        /*
                        let options: CameraOptions = {
                            //新接口返回base64直接
                            destinationType: this.camera.DestinationType.DATA_URL,
                            mediaType: this.camera.MediaType.PICTURE,
                            quality: 100,
                            targetWidth: 700,
                            targetHeight: 440
                          }
                        this.native.getPicture(options).then((imageBase64) => {
                            //拍摄成功 ， 上传图片
                            this.loginser.processIDcard(imageBase64,(obj) => {
                                if(obj){
                                    alert(JSON.stringify(obj))
                                }else{
                                    alert('解析失败')
                                }
                            })
                        });
                        */
                    }
                },{
                    text: '手动添写信息',
                    handler: () => {
                        this.goOtherPage('addManage',{})
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
    };
    goOtherPage(pagename,dat) {//去其他页面
        //回首页地图对接,定位区域地址
        if(!pagename){
            this.native.alert('开发中...');
              return
          }
        console.log(dat)
        this.manageCtrl.push(pagename,dat);
        // this.manageCtrl.pop();
        // this.tab.select(0);

    };
    gofavorite(type, phone, event) {
        location.href = type == 0 ? "sms:" : "tel:" + phone;
        console.log(type, phone)
    }
}
