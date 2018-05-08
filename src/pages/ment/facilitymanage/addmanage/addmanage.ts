import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ActionSheetController,ModalController } from 'ionic-angular';
import { NativeService } from "../../../../providers/NativeService";
import { MapService } from "../../../home/map-service";
import { MentService } from "../../ment.service";
import { HttpService } from "../../../../providers/http.service";
/**
 * Generated class for the RegistinfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-addmanage',
    templateUrl: 'addmanage.html',
})
export class addManage {
    public resgistFlg = true;
    public map: any;//地图对象
    public access = false;
    public isLoad = false;
    userInfo = {// 对象参数定义无效
        name: "",
        address: "",
        lat:null,
        lng:null,
        recorder_id:null,
        mobile: "",
        status,
        area_id: "",
        user_id:"",
        user_name: "",
        facilities_img:null,
        facilities_class:''
    };
    statusArr = [{ id: 1, text: '正常' }, { id: 2, text: '完全损坏' }, { id: 3, text: '部分损坏' }, { id: 4, text: '丢失' }];
    classArr = [{ id: 0, text: '水文设施' }, { id: 1, text: '路政设施' },{ id: 2, text: '环卫设施' }];
    departList;
    constructor(public navCtrl: NavController, public navParams: NavParams,private native: NativeService,public actionSheetCtrl: ActionSheetController,public mapService: MapService,private httpService: HttpService,public modalCtrl: ModalController,public mentservice: MentService) {
        try {
                this.userInfo = navParams.data;// 路由传递过来的人员信息参数
                console.log(this.userInfo)
                this.userInfo.user_id=this.native.UserSession._id
                this.userInfo.user_name=this.native.UserSession.name
                this.mapService.getspotarea().then(data => {
                    try {
                        this.departList = data
                    } catch (error) {
                        this.native.showToast('获取部门信息失败');
                    }
                }, err => { this.native.showToast('获取部门信息失败'); });
            } catch (error) {
                this.native.showToast(error)
            }

    }

    // 提交新建区域的数据
    doresigt() {
        if (!this.userInfo.name) {
            this.native.showToast('必须填写名称~');
            return false;
        }
        if (!this.userInfo.area_id) {
            this.native.showToast('必须选择所在区域~');
            return false;
        }
        if (!this.userInfo.mobile) {
            this.native.showToast('必须填写手机号~');
            return false;
        }
        if (this.userInfo.mobile) {
            var phoneyan=/^1[3|4|5|7|8][0-9]{9}$/
            if(!phoneyan.test(this.userInfo.mobile)){
                this.native.showToast('必须填写正确手机号~');
                return false;
            }
        }
        if(!this.userInfo.facilities_img){
            this.native.showToast('必须上传照片~');
            return false;
        }

        this.httpService.post("personfacilities/addFacilities",this.userInfo).subscribe(data => {
            try {
                let res = data.json();
                if (res.code == 200) {
                    this.native.showToast("添加成功！")
                    console.log(res)
                    this.navCtrl.pop();
                } else {
                    this.native.showToast(res.info);
                }
            } catch (error) {
                this.native.showToast(error);
            }
        }, err => { });

    }

    //点击放大
    showimage(name) {
        let profileModal = this.modalCtrl.create('imagePage', { imgurl: this.mentservice.chatser.native.appServer.file + 'images/other/' + name });
        profileModal.present();
    }
    //弹出选择图片或拍照
    showimagebutton(contorl) {
        let actionSheet = this.actionSheetCtrl.create({
            title: '请选择',
            buttons: [
                {
                    text: '上传照片',
                    handler: () => {
                        this.native.getPictureByPhotoLibrary({ allowEdit: false, saveToPhotoAlbum: true }).then((imageBase64) => {
                            // 上传图片
                            this.httpService.fileupload({ FileData: imageBase64, type: 1, filetype: 'jpg' }).then((name) => {
                                if (name) {
                                    this.userInfo.facilities_img = name;
                                }else{
                                    alert('没有name')
                                }
                            })
                        });
                    }
                },{
                    text: '拍照',
                    handler: () => {
                        this.native.getPictureByCamera({ allowEdit: false, saveToPhotoAlbum: true }).then((imageBase64) => {
                            //拍摄成功 ， 上传图片
                            this.httpService.fileupload({ FileData: imageBase64, type: 1, filetype: 'jpg' }).then((name) => {
                                if (name) {
                                    this.userInfo.facilities_img = name;
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
    };
    //选择地址
    selectmap(model) {
        if (this.access) {
            return;
        }
        let profileModal = this.modalCtrl.create('LocationPage', {});
        profileModal.onDidDismiss(res => {
            if (res) {
                this.userInfo.lat=res.location.lat;
                this.userInfo.lng=res.location.lng;
                this.userInfo.address=res.name + "(" + res.address + ")";
            }
        });
        profileModal.present();
    }
    showalluser(){
        let profileModal = this.modalCtrl.create('select_people');
        profileModal.onDidDismiss(res => {
            if(res) {
            this.userInfo.user_id = res._id
            this.userInfo.user_name = res.name
            }
        });
        profileModal.present();
    }
    goOtherPage(pagename,dat) {//去其他页面
        //回首页地图对接,定位区域地址
        if(!pagename){
            this.native.alert('开发中...');
              return
          }
        this.navCtrl.push(pagename,dat);
        // this.navCtrl.pop();
        // this.tab.select(0);

    };
}
