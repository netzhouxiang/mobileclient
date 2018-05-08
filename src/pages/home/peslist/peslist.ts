import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { NativeService } from "../../../providers/NativeService";
import { HttpService } from "../../../providers/http.service";
import { MapService } from '../map-service';
import _ from 'lodash'
import { Utils } from "../../../providers/Utils";
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
  searchKey: string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, public native: NativeService, private httpService: HttpService, public viewCtrl: ViewController, private mapService: MapService) {
    this.root = this.native.appServer.file;
    this.deptPersonList = this.navParams.get('personList');

  }
  doRefresh(refresher) {// 做刷新处理
    // this.deptPersonList = [];
    this.aload();
    setTimeout(() => {
        refresher.complete();
    }, 3000);
  }
  initInfo(){
    this.mapService.getDeptPerson().then(res=>{
      this.deptPersonList=res;
      // this.mygetAddress(res);
    },err=>{
      console.log(err);
    });
  }
  ionViewDidEnter() {

  }
  showChat(name) {
      return name.indexOf(this.searchKey) > -1;
  }
  personList: any;
  aload() {
    this.mapService.getDeptPerson().then(res => {
      let arr = [];
      for (let i in res) {
              // res[i].position = [res[i].location.lon + Math.random() * 0.0001, res[i].location.lat + Math.random() * 0.0001]
        res[i].position = [res[i].location.lon, res[i].location.lat]
        res[i].date = Utils.dateFormat(new Date(res[i].location.uploadtime * 1000), 'yyyy-MM-dd HH:mm');
        let count = new Date().getTime() - res[i].location.uploadtime * 1000;
        res[i].states = 0
        if (count < 300000) {//位置更新时间少于5分钟视为在线
          res[i].states = 1;
        }
        arr.push(res[i])
      }
      const perArr = arr.filter(obj => { //在线人数才显示
              return obj.states
      })
      this.personList = arr;
      console.log(this.personList)
      this.deptPersonList = this.personList;
      this.ionViewDidLoad();
    }, err => {

    });
  }
  ionViewDidLoad() {
    this.native.myStorage.get('mentPostion').then((val) => {//获取用户当前位置
      if(val && val.loc){
        const lnglat1 = new AMap.LngLat(val.loc[0], val.loc[1])
        let lnglat2 = null
        let strc = 0
        this.deptPersonList.forEach(element => {
          lnglat2 =  new AMap.LngLat(element.position[0],element.position[1])
          strc = Math.round(lnglat1.distance(lnglat2)/1000)
          element.strc = strc
          element.location.distance = strc
        });
      }
      // const arr = deptPersonList.filter(obj =>{
      //   return obj.states
      // })
      this.allPersonList = _.orderBy(this.deptPersonList, ['states', 'date' , 'strc'], ['desc', 'desc', 'asc']);
      this.deptPersonList = []
      // if(this.deptPersonList){
      //   // this.mygetAddress(this.deptPersonList);
      // }else{
      //   this.initInfo();
      // }

      // const arr =_.take(this.allPersonList, this.allPersonList.length <= 20?this.allPersonList.length:20);
      const arr =_.take(this.allPersonList, this.allPersonList.length);
      this.allPersonList=_.drop(this.allPersonList, this.allPersonList.length <= 20?this.allPersonList.length:20);
      this.deptPersonList.push(...arr)
    });

  }
  deptPersonList: any;
  allPersonList: any;
  viewMessages(obj?) {
    if(obj){
      if(obj.states!=1){
        this.native.showToast(obj.name+'离线中！');
        return;
      }
    }
      this.viewCtrl.dismiss(obj);
  }
  goWhat(obj,type){ //跳转
    if(type==1){
      if (obj.location.user_id == this.native.UserSession._id) {
        this.native.showToast('抱歉,不能与自己沟通');
        return;
      }
      this.navCtrl.push('ChatUserPage', { username: 'yzwg_' + obj.location.user_id })
    }else if(type == 2) {
      // obj.location.user_id
      const userArr = this.native.UserList;
      userArr.forEach(element => {
        if(obj.location.user_id == element._id) {
          console.log(`tel:${element.mobile}`)
          location.href = `tel:${element.mobile}`;
        }
      });
    }
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
  doInfinite(infiniteScroll){
    console.log('infiniteScroll');
    const arr =_.take(this.allPersonList, this.allPersonList.length <= 20?this.allPersonList.length:20);
    this.allPersonList=_.drop(this.allPersonList, this.allPersonList.length <= 20?this.allPersonList.length:20);
    this.deptPersonList.push(...arr)
    infiniteScroll.complete();
    if(this.allPersonList.length == 0) {
      infiniteScroll.enable(false);
    }
  }
}
