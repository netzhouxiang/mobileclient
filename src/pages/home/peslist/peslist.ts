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
  root:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public native: NativeService,private httpService: HttpService,public viewCtrl: ViewController,private mapService:MapService) {
    this.root=this.native.appServer.node;
  }
  ionViewDidEnter() {
    this.mapService.getDeptPerson().then(res=>{
        this.deptPersonList=res;
        this.mygetAddress(res);
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
  
  mygetAddress(res) {//逆地理编码
    let geocoder = new AMap.Geocoder({
      radius: 1000,
      extensions: "all"
    });
    for (let i in res) {
          this.deptPersonList[i].address='正在获取位置信息...'
          this.httpService.post('person/getPersonLatestPosition', {personID:res[i]._id,hideloading: true}).subscribe(
          data => {
            try {
              let res = data.json();
              this.deptPersonList[i].position=res.geolocation;
              let count=new Date().getTime()-new Date(res.positioningdate).getTime();
              if(count<300000){//位置更新时间少于5分钟视为离线
                  this.deptPersonList[i].status=1;
              }  
              geocoder.getAddress(res.geolocation, (status, result)=> {
                if (status === 'complete' && result.info === 'OK') {
                    this.deptPersonList[i].address=result.regeocode.formattedAddress;
                }
              });
            } catch (error) {
            
            }
          },
          err => {  }
        );
      }
    
  }
}
