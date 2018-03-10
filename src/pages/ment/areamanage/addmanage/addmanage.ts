import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ActionSheetController } from 'ionic-angular';
import { NativeService } from "../../../../providers/NativeService";
import { MapService } from "../../../home/map-service";
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
    resgistFlg = true;
    title: string = "区域人员添加";
    userInfo = {
        name: "",
        sex: "",
        nation: "",
        birthday: "",
        residence: "",
        idNum_residence:"",
        idNum: "",
        mobile: "",
        status,
        area_id: "",
        areaperson_img:null,//照片
        class:''
    };
    statusArr=[{ id: 0, text: '已删除' }, { id: 1, text: '正常' }, { id: 2, text: '脱贫' }, { id: 3, text: '外出' }, { id: 4, text: '生病' }];
    classArr=[{ id: 0, text: '贫困户' }, { id: 1, text: '孤寡老人' }];
    constructor(public navCtrl: NavController, public navParams: NavParams,private native: NativeService,public actionSheetCtrl: ActionSheetController,public mapService: MapService,private httpService: HttpService) {
        try {
                this.userInfo = navParams.data;// 路由传递过来的人员信息参数
                if (this.userInfo.sex == '女'){
                    this.userInfo.sex = '1'
                } else {
                    this.userInfo.sex = '0'
                }
                this.userInfo.status = '2'
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
    ionViewWillEnter() {
    }
    rolename = "";
    departList = null;
    doresigt() {
        if (!this.userInfo.name) {
            this.native.showToast('必须填写姓名~');
            return false;
        }
        if (!this.userInfo.idNum) {
            this.native.showToast('必须填写身份证号码~');
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
        if (this.resgistFlg) {
            //this.userInfo.departments[0] = this.departments;
            this.userInfo.birthday = Math.round(new Date(this.userInfo.birthday).getTime() / 1000) + ''
            
        }
        console.log(this.userInfo)
    }
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
                                    this.userInfo.areaperson_img = name;
                                    alert(JSON.stringify(name))
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
                                    this.userInfo.areaperson_img = name;
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
    goLogin() {//重新识别
        this.navCtrl.pop();
    }
}