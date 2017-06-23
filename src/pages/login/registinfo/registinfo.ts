import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Utils } from "../../../providers/Utils";
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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  userInfo={
    birthday:Utils.dateFormat(new Date()),
    gender:'男',
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
     this.navCtrl.setRoot('TabsPage');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistinfoPage');
  }

}
