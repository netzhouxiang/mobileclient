import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
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
  root: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public native: NativeService, private httpService: HttpService, public viewCtrl: ViewController, private mapService: MapService) {
    this.root = this.native.appServer.file;
    this.deptPersonList = navParams.get('personList');
    if(this.deptPersonList){
      this.mygetAddress(this.deptPersonList);
    }else{
      this.initInfo();
    }
    
  }
  initInfo(){
    this.mapService.getDeptPerson().then(res=>{
      this.deptPersonList=res;
      this.mygetAddress(res);
    },err=>{
      console.log(err);
    });
  }
  ionViewDidEnter() {
    
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PeslistPage');
  }
  deptPersonList: any;
  viewMessages(obj?) {
    this.viewCtrl.dismiss(obj);
  }

  mygetAddress(res) {//逆地理编码
    let geocoder = new AMap.Geocoder({
      radius: 1000,
      extensions: "all"
    });
    for (let i in res) {
      this.deptPersonList[i].address = '正在获取位置信息...'

      if (res[i].position) {
        geocoder.getAddress(res[i].position, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            this.deptPersonList[i].address = result.regeocode.formattedAddress;
          }
        });
      } else {
        this.deptPersonList[i].address = '暂未上传位置信息...'
      }



    }

  }
}
