import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { NativeService } from "../../../providers/NativeService";
import { HttpService } from "../../../providers/http.service";
import { MapService } from '../map-service';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public native: NativeService,private httpService: HttpService,public viewCtrl: ViewController,private mapService:MapService) {
  }
  ionViewDidEnter() {
    this.mapService.getDeptPerson().then(res=>{
        this.deptPersonList=res;
    },err=>{
      console.log(err);
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PeslistPage');
  }
  deptPersonList:any;
  viewMessages(position?){
    this.viewCtrl.dismiss(position);
  }
}
