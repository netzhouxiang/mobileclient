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
    selector: 'page-addpeoplemanage',
    templateUrl: 'addpeoplemanage.html',
})
export class addPeopleManage {
    resgistFlg = true;
    map: any;//地图对象
    title: string = "区域人员添加";
    access = false;
    userInfo = {// 对象参数定义无效
        name: "",
        sex: "",
        nation: "",
        birthday: "",
        residence: "",
        lat:null,
        lng:null,
        idNum_residence:"",
        idNum: "",
        recorder_id:null,
        mobile: "",
        status,
        area_id: "",
        areaperson_img:null,
        class:''
    };
    statusArr = [{ id: 1, text: '正常' }, { id: 2, text: '脱贫' }, { id: 3, text: '外出' }, { id: 4, text: '生病' }];
    classArr = [{ id: 0, text: '贫困户' }, { id: 1, text: '孤寡老人' }];
    departList;
    constructor(public navCtrl: NavController, public navParams: NavParams,private native: NativeService,public actionSheetCtrl: ActionSheetController,public mapService: MapService,private httpService: HttpService,public modalCtrl: ModalController,public mentservice: MentService) {
        try {
                this.userInfo = navParams.data;// 路由传递过来的人员信息参数
                if (this.userInfo.sex == '女'){
                    this.userInfo.sex = '1'
                } else {
                    this.userInfo.sex = '0'
                }
                this.userInfo.recorder_id=this.native.UserSession._id
                console.log(this.userInfo)
                this.mapService.getspotarea().then(data => {
                    try {
                        this.departList = data
                        console.log(this.departList)
                        console.log(this.userInfo)
                    } catch (error) {
                        this.native.showToast('获取部门信息失败');
                    }
                }, err => { this.native.showToast('获取部门信息失败'); });
            } catch (error) {
                this.native.showToast(error)
            }

    }

    // 提交新建人员数据
    doresigt() {
        console.log(this.userInfo)
        if (!this.userInfo.name) {
            this.native.showToast('必须填写姓名~');
            return false;
        }
        if (!this.userInfo.idNum) {
            this.native.showToast('必须填写身份证号码~');
            return false;
        }
        if (this.userInfo.idNum) {
            var idNumyan=/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
            if(!idNumyan.test(this.userInfo.idNum)){
                this.native.showToast('必须填写正确身份证号码~');
                return false;
            }
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
        if(!this.userInfo.areaperson_img){
            this.native.showToast('必须上传照片~');
            // return false;
        }
        this.httpService.post("personfacilities/addPerson",this.userInfo).subscribe(data => {
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
                                    this.userInfo.areaperson_img = name;
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
                this.userInfo.residence=res.name + "(" + res.address + ")";
            }
        });
        profileModal.present();
    }
}
