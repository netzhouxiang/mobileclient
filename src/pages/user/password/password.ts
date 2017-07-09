import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeService } from "../../../providers/NativeService";
import { HttpService } from "../../../providers/http.service";
/**
 * Generated class for the PasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-password',
  templateUrl: 'password.html',
})
export class PasswordPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public native: NativeService, private httpService: HttpService,) {
  }
  requestInfo={
    url:"/personalinfo/updatepersonpassword",
    idNum:this.native.UserSession.idNum,
    _id:this.native.UserSession._id,
    opwd:'',
    npwd:'',
    npwdc:""
  }
  fix(){
      if(!this.requestInfo.opwd){
        this.native.showToast('请填写原密码~');
        return false;
      }
      if(!this.requestInfo.npwd){
        this.native.showToast('请填写新密码~');
        return false;
      }
      if(!this.requestInfo.npwdc){
        this.native.showToast('请确认新密码~');
        return false;
      }
      if(this.requestInfo.npwd!=this.requestInfo.npwdc){
        this.native.showToast('新密码输入不一致~');
        return false;
      }
      this.httpService.post(this.requestInfo.url,this.requestInfo).subscribe(data=>{
        try {
          let res=data.json();
          if(res.error){
            this.native.showToast(res.error.error);
            
          }else{
            this.native.alert('密码修改成功',()=>{
              this.navCtrl.pop();
            });
          }
        } catch (error) {
          this.native.showToast(error);
        }
      },err=>{
        this.native.showToast(err);
      });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordPage');
  }

}
