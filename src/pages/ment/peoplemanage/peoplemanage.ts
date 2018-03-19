import { Component } from '@angular/core';
import { IonicPage, NavController,ActionSheetController,ModalController } from 'ionic-angular';
import { NativeService } from "../../../providers/NativeService";
import { HttpService } from "../../../providers/http.service";
import { LoginService } from '../../login/login-service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MentService } from "../ment.service";
/**
 * Generated class for the StrokePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-peoplemanage',
    templateUrl: 'peoplemanage.html',
})

export class peopleManage {

    constructor(public manageCtrl: NavController,public native: NativeService, private httpService: HttpService,public actionSheetCtrl: ActionSheetController,private loginser: LoginService, private camera: Camera,public mentservice: MentService,public modalCtrl: ModalController) {
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
    allarea;//所有网格区域
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
                url: "personfacilities/GetPersonForId",
                user_id: this.native.UserSession._id
            }
            this.httpService.post(requestInfo.url,{user_id:requestInfo.user_id}).subscribe(data => {
                try {
                    let res = data.json();
                    console.log(data)
                    if (res.code == 200) {
                        this.strokeList = res.info.list;
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
                                    obj.idNum_residence=obj.residence;
                                    obj.residence=null;
                                    this.goOtherPage('addPeopleManage',obj)
                                }else{
                                    alert('解析失败')
                                }
                            })
                        });
                    }
                },{
                    text: '手动添写信息',
                    handler: () => {
                        this.goOtherPage('addPeopleManage',{})
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
          console.log(pagename,dat)
        this.manageCtrl.push(pagename,dat);
        // this.manageCtrl.pop();
        // this.tab.select(0);

    };
    gofavorite(type, phone, event) {
        location.href = type == 0 ? "sms:" : "tel:" + phone;
        console.log(type, phone)
    }
}
