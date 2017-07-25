import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MentService } from "../../ment.service";
/**
 * Generated class for the StrokePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-reject',
  templateUrl: 'reject.html',
})
export class rejectPage {
  constructor(public navCtrl: NavController, public navParams: NavParams, public mentservice: MentService) {
    
  }
  ionViewDidLoad() {
  }

}
