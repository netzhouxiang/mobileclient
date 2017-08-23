import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Utils } from "../../../providers/Utils";
import { NativeService } from "../../../providers/NativeService";
import { LoginService } from '../login-service';
import { HttpService } from "../../../providers/http.service";
import { Device } from '@ionic-native/device';
import { Sim } from '@ionic-native/sim';
/**
 * Generated class for the RegistinfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-registinfo',
    templateUrl: 'registinfo.html',
})
export class RegistinfoPage {
    resgistFlg = true;
    title: string = "注册信息";
    constructor(private sim: Sim, private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public device: Device, private native: NativeService, private loginser: LoginService, private httpService: HttpService, private platform: Platform) {
        this.userInfo = Object.assign(this.userInfo, navParams.get('perInfo'));
        if (navParams.get('perInfo')) {//如果是注册
            this.native.UserSession = this.userInfo;
            this.userStatus();
        }
        if (navParams.get('type') == 'update') {//判断是否修改信息
            this.resgistFlg = false;
            this.title = "修改个人信息";
            this.native.myStorage.get('UserSession').then((val) => {//获取用户信息
                if (val) {
                    this.userInfo = val;
                    this.departments = this.userInfo.departments[0];
                    this.userInfo.department = this.departments.department;
                    this.getjobList();
                }
            });
        }
        this.httpService.post('personadminroute/getAllDepartments', { hideloading: true }).subscribe(data => {
            try {
                this.departList = data.json().success;
            } catch (error) {
                this.native.showToast('获取部门信息失败');
            }
        }, err => { this.native.showToast('获取部门信息失败'); });
        
    }
    setphoneNumber(){//设置手机号码
        this.sim.getSimInfo().then(
            (info) => {
                this.userInfo.mobile = info.phoneNumber;
            },
            (err) => console.log('Unable to get sim info: ', err)
        );
    }
    ionViewWillEnter() {
    }
    departments = {
        role: 'worker',//默认
        department: '',
    }
    userInfo = {//用户信息
        images: { coverSmall: '' },
        name: '',
        nation: '汉',
        birthday: Utils.dateFormat(new Date()),
        sex: '男',
        idNum: '',
        mobile: '',
        residence: '',
        departments: [],
        title: '',
        department: '',
        pwd: '',
        mobileUUid: this.device.uuid
    }
    departList = [];
    jobList = [];
    getjobList() {
        this.httpService.post('personadminroute/getpersontitleTodepartment', { departmentID: this.departments.department }).subscribe(data => {
            try {
                this.jobList = data.json().success;

                if (this.userInfo.department != this.departments.department) {
                    this.userInfo.title = '';
                }

            } catch (error) {
                this.native.showToast('获取职位信息失败');
            }
        }, err => { this.native.showToast('获取职位信息失败'); });
    }
    doresigt() {
        if (!this.userInfo.name) {
            this.native.showToast('必须填写姓名~');
            return false;
        }
        if (!this.userInfo.idNum) {
            this.native.showToast('必须填写身份证号码~');
            return false;
        }
        if (!this.departments.department) {
            this.native.showToast('必须选择部门~');
            return false;
        }
        if (this.jobList.length && !this.userInfo.title) {
            this.native.showToast('必须选择职称~');
            return false;
        }
        if (this.resgistFlg && !this.userInfo.pwd) {
            this.native.showToast('请输入6位以上审核密码~');
            return false;
        }
        if (this.resgistFlg && this.userInfo.pwd.length < 6) {
            this.native.showToast('密码不能少于6位哦~');
            return false;
        }
        if (this.resgistFlg) {
            this.userInfo.departments[0] = this.departments;
            this.loginser.registered(this.userInfo).subscribe(data => {
                this.native.UserSession = data;
                this.telPhone();
                // this.navCtrl.setRoot('TabsPage');
            }, err => {
                this.telPhone();
                this.native.showToast(err);
            });
        } else {
            this.showSetPwd();
        }
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad RegistinfoPage');
    }
    goLogin() {//重新识别
        this.navCtrl.pop();
    }
    showSetPwd(flg: boolean = true) {//审核密码
        let alert = this.alertCtrl.create({
            title: '验证',
            enableBackdropDismiss: flg,
            inputs: [
                {
                    name: 'password',
                    placeholder: '请输入6位审核密码',
                    type: 'password'
                }
            ],
            buttons: [
                {
                    text: '确定',
                    handler: data => {
                        if (data.password) { 
                             this.checkPwd(data.password).then((res)=>{
                                
                                let navTransition = alert.dismiss();
                                navTransition.then(() => {
                                    this.updateInfo();
                                });
                            },err=>{
                                this.native.showToast(err);
                            });
                        } else {
                            this.native.showToast('请输入审核密码');
                            // invalid login
                        }
                        return false;
                    }
                }
            ]
        });
        alert.present();
    }
    checkPwd(password) {
        return new Promise((resolve, reject) => {
            this.httpService.post('personalinfo/ispersonpassword', {
                _id: this.native.UserSession._id,
                pwd: password
            }).subscribe(data => {
                try {
                    let res = data.json();
                    if (res.success) {
                        resolve(res.success);
                    } else {
                        reject('密码错误');
                    }
                } catch (error) {
                   reject(error); 
                }
            }, err => {
                reject(err);
            });
        });
    }
    updateInfo() {//修改信息
        this.httpService.post('personadminroute/updatepersoninfo', this.userInfo).subscribe(data => {
            try {
                let res = data.json();
                if (res.success) {
                    this.genInfo();
                    if (this.navParams.get('type') == 'update') {
                        this.native.showToast('信息修改成功~');
                    } else {//注册修改信息跳到tab页
                       // this.navCtrl.setRoot('TabsPage');
                      this.navCtrl.pop();
                    }


                }
            } catch (error) {
                this.native.showToast(error);
            }
        }, err => {
            this.native.showToast(err);
        });
    }
    genInfo() {//更新用户信息
        let myuuid = this.device.uuid;
        if (!myuuid) {
            myuuid = 'c7f89e97f9194631';
        }
        this.loginser.getUserByUUid(myuuid).subscribe(data => {
            this.native.UserSession = data;
            this.native.myStorage.set('UserSession', data);
        }, err => {
        });
    }
    telPhone(){
             this.native.confirm('您不是工作人员或信息未录入，请联系系统管理员，电话12345678', () => {
                location.href =  "tel:23123213" ;
                this.telPhone();
        }, ()=>{
            this.platform.exitApp();
            return false;
            
        },'提示','退出','拨打');
    }
    userStatus() {//判断
        let myuuid = this.device.uuid;
        if (!myuuid) {
            myuuid = 'c7f89e97f9194631';
        }
        let requert = {
            url: 'personadminroute/sendcheckperson',
            name: this.userInfo.name,
            idNum: this.userInfo.idNum,
            mobileUUid: myuuid
        }
         
        this.httpService.post(requert.url, requert).subscribe(data => {
            try {
                let res = data.json();
                console.log(res);
                this.resgistFlg = false;
                if (res.error === 1000) {//新注册
                    this.resgistFlg = true;
                } else if (res.success === 2000) {//待审核闲散人员
                    this.telPhone();
                } else if (res.success === 3000) {//'已存在，没有绑定手机'
                    this.userInfo=Object.assign(this.userInfo,res.obj);
                    this.departments = this.userInfo.departments[0];
                    this.userInfo.department = this.departments.department;
                    this.showSetTwoPwd();
                    this.setphoneNumber();
                } else if (res.success === 4000) {//'已注册，手机uuid已更改'
                    this.userInfo.mobileUUid=requert.mobileUUid;
                    this.native.UserSession._id=res.obj._id;
                    this.showSetPwd(false);
                    this.setphoneNumber();
                } else if (res.success === 5000) {//'已注册正常用户'                   
                }
            } catch (error) {
                this.native.showToast(error);
            }
        }, err => {
            this.native.showToast(err);
        });
    }
    showSetTwoPwd() {//审核密码
        let alert = this.alertCtrl.create({
            title: '验证',
            enableBackdropDismiss: false,
            inputs: [
                {
                    name: 'password',
                    placeholder: '请输入6位以上审核密码',
                    type: 'password'
                },
                {
                    name: 'newpassword',
                    placeholder: '请再次输入审核密码',
                    type: 'password'
                }
            ],
            buttons: [
                {
                    text: '确定',
                    handler: data => {
                        if (data.password && data.password.length >= 6) {
                            if (data.password == data.newpassword) {
                                this.userInfo.pwd = data.password;
                                this.updateInfo();
                            } else {
                                this.native.showToast('两次密码不一致');
                                // invalid login
                                return false;
                            }

                        } else {
                            this.native.showToast('请输入6位以上审核密码');
                            // invalid login
                            return false;
                        }
                    }
                }
            ]
        });
        alert.present();
    }
}
