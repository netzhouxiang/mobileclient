import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeService } from "../../../providers/NativeService";
/**
 * Generated class for the StrokePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-stroke',
  templateUrl: 'stroke.html',
})
export class StrokePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public native: NativeService,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StrokePage');
  }

}
