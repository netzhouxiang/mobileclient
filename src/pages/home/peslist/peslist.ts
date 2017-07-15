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
declare var AMap;
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
        this.mygetAddress(res);
    },err=>{
      this.deptPersonList=[{_id:"同事ID",name:"张三",position:[113.894373,22.555997],status:1}];
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
  mygetAddress(res) {//逆地理编码
    let arr=new Array();
    res.forEach(element => {
      arr.push(element.position);
    });
    if(!arr.length){
        return;
    }
    let geocoder = new AMap.Geocoder({
      radius: 1000,
      extensions: "all"
    });
    geocoder.getAddress(arr, (status, result)=> {
      if (status === 'complete' && result.info === 'OK') {
          for (let i in result.regeocodes) {
             this.deptPersonList[i].address=result.regeocodes[i].formattedAddress;
          }
      }
    });
  }
}
