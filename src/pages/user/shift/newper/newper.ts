import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { NativeService } from "../../../../providers/NativeService";
import { HttpService } from "../../../../providers/http.service";
import { ChatService } from "../../../../providers/chat-service";
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
  userlist = [];
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public native: NativeService, private httpService: HttpService, public chatser: ChatService, ) {
  }
  ionViewDidLoad() {
    //检索用户
    if (this.native.UserList && this.native.UserList.length > 0) {
      this.native.UserList.forEach(_user => {
        if (_user.department_id == this.native.UserSession.department._id) {
          this.userlist.push(_user);
        }
      });
    }
    console.log('ionViewDidLoad NewperPage');
  }
  dismiss(data?) {
    this.viewCtrl.dismiss(data);
  }

}
