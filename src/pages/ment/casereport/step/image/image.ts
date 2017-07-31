import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
/**
 * Generated class for the StrokePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-image',
  templateUrl: 'image.html',
})
export class imagePage {
  imgurl: string = "";
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams) {
    this.imgurl = navParams.get("imgurl");
  }
  ionViewDidLoad() {
  }
  dismiss(data?) {
    this.viewCtrl.dismiss(data);
  }
}
