import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeService } from "../../../providers/NativeService";
import { HttpService } from "../../../providers/http.service";
/**
 * Generated class for the PeslistPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-peslist',
  templateUrl: 'peslist.html',
})
export class PeslistPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public native: NativeService,private httpService: HttpService) {
  }
  getDeptPerson(){//查询部门人员列表
    let reqinfo={
      url:'',
      personid:this.native.UserSession.curUserId,
    }
    this.httpService.post(reqinfo.url, reqinfo).subscribe(
      data => {
        try {
          let res=data.json();
        } catch (error) {

        }
      },
      err => {}
    );
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PeslistPage');
  }

}
