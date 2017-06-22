import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  backgrounds = [
    "assets/img/login/background-1.jpg",
    "assets/img/login/background-2.jpg",
    "assets/img/login/background-3.jpg"
  ]
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  doLogin() {
    this.navCtrl.setRoot('TabsPage');
  }
  presentModal() {
    //  let modal = Modal.create('ProfilePage');
    //  this.navCtrl.present(modal);
   }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
