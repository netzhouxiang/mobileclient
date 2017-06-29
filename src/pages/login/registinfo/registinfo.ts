import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Utils } from "../../../providers/Utils";
import { NativeService } from "../../../providers/NativeService";
import { LoginService } from '../login-service';
import { HttpService } from "../../../providers/http.service";
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
  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public native: NativeService, private loginser: LoginService, private httpService: HttpService, ) {
    this.userInfo = Object.assign(this.userInfo, navParams.get('perInfo'));
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
    departments: {
      role: 'worker',//默认
      department: ''
    },
    title: '',
    department: '',
    pwd: '',
    mobileUUid: localStorage.getItem("uuid")
  }
  departList = [];
  jobList = [];
  getjobList() {
    this.httpService.post('personadminroute/getpersontitleTodepartment', { departmentID: this.userInfo.departments.department }).subscribe(data => {
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
    if (!this.userInfo.departments.department) {
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
    this.loginser.registered(this.userInfo).subscribe(data => {
      this.native.UserSession = data;
      this.navCtrl.setRoot('TabsPage');
    }, err => {
      this.native.showLoading(err);
    });

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