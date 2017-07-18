import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Utils } from "../../../providers/Utils";
import { NativeService } from "../../../providers/NativeService";
import { LoginService } from '../login-service';
import { HttpService } from "../../../providers/http.service";
import { Device } from '@ionic-native/device';
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
    constructor(private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public device: Device, private native: NativeService, private loginser: LoginService, private httpService: HttpService, ) {
        this.userInfo = Object.assign(this.userInfo, navParams.get('perInfo'));
        console.log(this.native.UserSession);
        if (navParams.get('type') == 'update') {//判断是否修改信息
            this.resgistFlg = false;
            this.title = "修改个人信息";
            this.native.myStorage.get('UserSession').then((val) => {//获取用户信息
                if (val) {
                    this.userInfo = val;
                    this.departments =this.userInfo.departments[0];
                    this.userInfo.department= this.departments.department;
                    this.getjobList();
                }
            });
            
        }
        this.httpService.post('personadminroute/getAllDepartments', { hideloading: true }).subscribe(data => {
            try {
                this.departList = data.json();
            } catch (error) {
                this.native.showToast('获取部门信息失败');
            }
        }, err => { this.native.showToast('获取部门信息失败'); });
    }
    ionViewWillEnter(){     
    }
    departments={
        role: 'worker',//默认
        department: '',
        _id:''
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
                
                if(this.userInfo.department !=this.departments.department){
                    this.userInfo.title='';
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
        if( this.resgistFlg&&!this.userInfo.pwd ){
            this.native.showToast('请输入6位审核密码~');
            return false;
        }
        if (this.resgistFlg&& this.userInfo.pwd.length != 6 ) {
            this.native.showToast('密码只能6位哦~');
            return false;
        }
        if (this.resgistFlg) {
            this.userInfo.departments[0]=this.departments;
            this.loginser.registered(this.userInfo).subscribe(data => {
                this.native.UserSession = data;
                this.navCtrl.setRoot('TabsPage');
            }, err => {
                this.native.showLoading(err);
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
    showSetPwd() {//审核密码
        let alert = this.alertCtrl.create({
            title: '验证',
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
                            this.checkPwd(data.password);
                        } else {
                            this.native.showToast('请输入审核密码');
                            // invalid login
                            return false;
                        }
                    }
                }
            ]
        });
        alert.present();
    }
    checkPwd(password){
        this.httpService.post('personalinfo/ispersonpassword', {
            _id:this.native.UserSession._id,
            pwd:password
        }).subscribe(data => {
                try {
                    let res = data.json();
                    if (res.success) {
                        this.updateInfo();
                    }else {
                        this.native.showToast('密码错误');
                    }
                } catch (error) {
                    this.native.showToast(error);
                }
            }, err => {
                this.native.showToast(err);
            });
    }
    updateInfo() {//修改信息
        this.httpService.post('personadminroute/updatepersoninfo', this.userInfo).subscribe(data => {
                try {
                    let res = data.json();
                    if (res.success) {
                        this.native.showToast('信息修改成功');
                        this.genInfo();
                        this.navCtrl.pop();
                        
                    }
                } catch (error) {
                    this.native.showToast(error);
                }
            }, err => {
                this.native.showToast(err);
            });
    }
    genInfo(){//更新用户信息
            let myuuid = this.device.uuid;
            if(!myuuid){
                        myuuid ='c7f89e97f9194631';
                }
            this.loginser.getUserByUUid(myuuid).subscribe(data => {
                this.native.UserSession = data;
                this.native.myStorage.set('UserSession', data);
            }, err => {
            });
    }

}
