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
    birthday:Utils.dateFormat(new Date())
  }
  
  doresigt(){
     this.navCtrl.setRoot('TabsPage');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistinfoPage');
  }

}
