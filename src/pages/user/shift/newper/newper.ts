import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { NativeService } from "../../../../providers/NativeService";
import { HttpService } from "../../../../providers/http.service";
/**
 * Generated class for the NewperPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-newper',
  templateUrl: 'newper.html',
})
export class NewperPage {

  constructor(public navCtrl: NavController,public viewCtrl: ViewController, public navParams: NavParams,public native: NativeService, private httpService: HttpService,) {
    this.getPerson();
  }
  perList=new Array();
  getPerson(){
    this.httpService.post('personadminroute/getdepartmentTopeople', {department:this.native.UserSession.departments._id}).subscribe(data => {
      try {
        let res = data.json();
        if (res.error!=='undefined') {
          this.native.showToast(res.error);
        } else {
          this.perList=res;
        }
      } catch (error) {
        this.native.showToast(error);
      }
    }, err => {
      this.native.showToast(err);
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad NewperPage');
  }
  dismiss(data?) {
    this.viewCtrl.dismiss(data);
  }

}
