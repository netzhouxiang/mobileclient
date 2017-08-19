import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
/**
 * Generated class for the MentPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-ment',
  templateUrl: 'ment.html',
})
export class MentPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private native: NativeService) {
  }
  goOtherPage(pagename, data = {}) {//去目标页面
    if(!pagename){
      this.native.alert('开发中...');
        return
    }
    this.navCtrl.push(pagename, data);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad MentPage');
  }

}
