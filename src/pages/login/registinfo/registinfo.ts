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
  resgistFlg=true;
  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams,public  device: Device, public native: NativeService, private loginser: LoginService, private httpService: HttpService, ) {
    this.userInfo = Object.assign(this.userInfo, navParams.get('perInfo'));
    if(navParams.get('type')=='update'){//判断是否修改信息
      this.resgistFlg=false;
      this.userInfo=this.native.UserSession;
    }
    this.httpService.post('personadminroute/getAllDepartments', { hideloading: true }).subscribe(data => {
      try {
        this.departList = data.json();
      } catch (error) {
        this.native.showToast('获取部门信息失败');
      }
    }, err => { this.native.showToast('获取部门信息失败'); });
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
    departments:[{
      role: 'worker',//默认
      department: ''
    }],
    title: '',
    department: '',
    pwd: '',
    mobileUUid: this.device.uuid
  }
  departList = [];
  jobList = [];
  getjobList() {
    this.httpService.post('personadminroute/getpersontitleTodepartment', { departmentID: this.userInfo.departments[0].department }).subscribe(data => {
      try {
        this.jobList = data.json().success;
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
    if (!this.userInfo.departments[0].department) {
      this.native.showToast('必须选择部门~');
      return false;
    }
    if (this.jobList.length && !this.userInfo.title) {
      this.native.showToast('必须选择职称~');
      return false;
    }
    if (this.userInfo.pwd && this.userInfo.pwd.length != 6) {
      this.native.showToast('密码只能6位哦~');
      return false;
    }
    if(this.resgistFlg){
          this.loginser.registered(this.userInfo).subscribe(data => {
            this.native.UserSession = data;
            this.navCtrl.setRoot('TabsPage');
          }, err => {
            this.native.showLoading(err);
          });
    }else{
      this.httpService.post('/personalinfo/',this.userInfo).subscribe(data=>{
      try {
          let res=data.json();
          if(res.success){
            this.native.showToast('信息修改成功');
          }
        } catch (error) {
          this.native.showToast(error);
        }
      },err=>{
        this.native.showToast(err);
      });
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistinfoPage');
  }
  goLogin() {//重新识别
    this.navCtrl.pop();
  }
  showSetPwd() {//设置登录密码
    let alert = this.alertCtrl.create({
      title: 'Login',
      inputs: [
        {
          name: 'password',
          placeholder: '请输入6位审核密码',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '确定',
          handler: data => {
            if (data.password) {
              // logged in!
            } else {
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