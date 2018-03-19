import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController,ActionSheetController } from 'ionic-angular';
import { NativeService } from "../../../../providers/NativeService";
import { MapService } from "../../../home/map-service";
import { MentService } from "../../ment.service";
import { HttpService } from "../../../../providers/http.service";
/**
 * Generated class for the StrokePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-addupdatefacility',
    templateUrl: 'addupdatefacility.html',
})
export class addupdatefacility {
    statusList= [{ key: 1, val: '正常' }, { key: 2, val: '完全损坏' }, { key: 3, val: '部分损坏' }, { key: 4, val: '丢失' }];

    ajaxdata = {
        facilities_id:"",
        recorder_id: "",
        facilities_img:null,
        status:1,
        lat:null,
        lng:null
    };
    constructor(public navCtrl: NavController, public navParams: NavParams, public mapService: MapService, public native: NativeService,public mentservice: MentService, public actionSheetCtrl: ActionSheetController,public modalCtrl: ModalController,private httpService: HttpService) {
        // this.native.showLoading();
        var user_id=this.navParams.data.user// 接收路由切换传递过来的指
        this.ajaxdata.facilities_id = user_id;
        this.ajaxdata.recorder_id=this.native.UserSession._id;// 获取全局中当前登陆的用户id
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
        console.log(id+' ' + isid)
                return;
            }
        });
        return isid;
    };

    //弹出选择图片或拍照
    showimagebutton(contorl) {
        let actionSheet = this.actionSheetCtrl.create({
            title: '请选择',
            buttons: [
                {
                    text: '上传图片',
                    handler: () => {
                        this.native.getPictureByPhotoLibrary({ allowEdit: false, saveToPhotoAlbum: true }).then((imageBase64) => {
                            // 上传图片
                            this.httpService.fileupload({ FileData: imageBase64, type: 1, filetype: 'jpg' }).then((name) => {
                                if (name) {
                                    this.ajaxdata.facilities_img = name;
                                }else{
                                    alert('没有name')
                                }
                            })
                        });
                    }
                },{
                    text: '拍照',
                    handler: () => {
                        this.native.getPictureByCamera().then((imageBase64) => {
                            //拍摄成功 ， 上传图片
                            this.httpService.fileupload({ FileData: imageBase64, type: 1, filetype: 'jpg' }).then((name) => {
                                if (name) {
                                    this.ajaxdata.facilities_img = name;
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
    //点击放大
    showimage(name) {
        let profileModal = this.modalCtrl.create('imagePage', { imgurl: this.mentservice.chatser.native.appServer.file + 'images/other/' + name });
        profileModal.present();
    }
    //删除相片
    delimage() {
        this.ajaxdata.facilities_img=null;
    }
    savesubmit(){
        if(!this.ajaxdata.facilities_img){this.native.showToast('请上传图片！');return;}
        if(!this.native.Currentposition){this.native.showToast('无法定位当前位置，请稍后上传！');return;}
        this.ajaxdata.lat=this.native.Currentposition[1]
        this.ajaxdata.lng=this.native.Currentposition[0]

        this.httpService.post("personfacilities/addUpdateFacilitiesInfo",this.ajaxdata).subscribe(data => {
            try {
                let res = data.json();
                if (res.code == 200) {
                    this.native.showToast("添加成功！")
                    this.navCtrl.pop();
                } else {
                    this.native.showToast(res.info);
                }
            } catch (error) {
                this.native.showToast(error);
            }
        }, err => { });
    }
    goOtherPage(obj,dat) {//去其他页面
        //回首页地图对接,定位区域地址
        console.log(obj)
        this.navCtrl.push(obj,dat);
    }
}
