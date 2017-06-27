import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Utils } from "../../../providers/Utils";
import { NativeService } from "../../../providers/NativeService";
import { LoginService } from '../login-service';
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
  constructor(public navCtrl: NavController, public navParams: NavParams,public native: NativeService,private loginser: LoginService,) {
      this.userInfo = Object.assign(this.userInfo,navParams.get('perInfo'))
  }
  userInfo={//用户信息
    name:'',
    nation:'汉',
    birthday:Utils.dateFormat(new Date()),
    sex:'男',
    idNum:'',
    mobile:'',
    residence:'',
    department:'',
    jobtitle:""
  }
  departList=[{depart:'城市管理局',jobtitle:[{job:'负责人'},{job:'副负责人'},{job:'员工'}]},
  {depart:'城市管理局下属部门12',jobtitle:[{job:'负责人'},{job:'副负责人'},{job:'员工'}]},
  {depart:'区政府',jobtitle:[{job:'负责人'},{job:'副负责人'},{job:'员工'}]}];
  jobList=[];
  getjobList(){
    let arr=[];
    for(let i=0;i<this.departList.length;i++){
      if(this.departList[i].depart==this.userInfo.department){
            arr=this.departList[i].jobtitle;
            break;
      }
      
    }
    this.jobList= arr;
  }
  doresigt(){
    if(!this.userInfo.name){
      this.native.showToast('必须填写姓名~');
      return false;
    }
    if(!this.userInfo.idNum){
      this.native.showToast('必须填写身份证号码~');
      return false;
    }
    if(!this.userInfo.department){
      this.native.showToast('必须选择部门~');
      return false;
    }
    if(!this.userInfo.jobtitle){
      this.native.showToast('必须选择职称~');
      return false;
    }
    this.loginser.registered(this.userInfo).subscribe(data=>{
      this.native.UserSession = data;
      this.navCtrl.setRoot('TabsPage');
    },err=>{
      this.native.alert(err);
    });
     
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistinfoPage');
  }
  goLogin(){//重新识别
    this.navCtrl.pop();
  }
}
