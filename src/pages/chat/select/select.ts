import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the RegisttipPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
        selector: 'page-select',
        templateUrl: 'select.html',
})
export class SelectPage {
    pet2: string = "selectdept";
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SelectPage');
    }
    dismiss() {
        this.viewCtrl.dismiss();
    }
}
