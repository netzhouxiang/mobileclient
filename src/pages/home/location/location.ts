import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { NativeService } from "../../../providers/NativeService";
import { HttpService } from "../../../providers/http.service";
/**
 * Generated class for the LocationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var AMap, AMapUI;
@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})

export class LocationPage {
  @ViewChild('map_cont') map_container: ElementRef;
  map: any;//地图对象
  autocomplete: any;
  placeSearch: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public native: NativeService, private httpService: HttpService,
    private elementRef: ElementRef) {
  }
  pacleStr: any;
  ionViewDidLoad() {
    this.native.myStorage.get('mentPostion').then((val) => {//获取用户当前位置
        this.initMap(val.loc);
      });
    
  }
  initMap(loc?) {
    try {
      this.map = new AMap.Map(this.map_container.nativeElement, {
        view: new AMap.View2D({//创建地图二维视口
          zoom: 18, //设置地图缩放级别
          rotateEnable: true,
          showBuildingBlock: true,
          center:loc
        })

      });
      var autoOptions = {
        datatype: "all", //all-返回所有数据类型、poi-返回POI数据类型、bus-返回公交站点数据类型、busline-返回公交线路数据类型
      };
      // AMap.Autocomplete输入提示，根据输入关键字提示匹配信息
      this.autocomplete = new AMap.Autocomplete(autoOptions);
      this.placeSearch = new AMap.PlaceSearch();
      this.selectLoc();//加载中心点位置
      AMap.event.addListener(this.map, 'moveend', () => {
        this.selectLoc();
      });
    } catch (error) {
      // this.native.showToast('地图加载失败');
    }

  }
  timeout: any;
  placeList = new Array();
  placeChange() {//地点查询
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.autocomplete.search(this.pacleStr, (status, result) => {
        this.placeList = new Array();
        if (status == 'complete') {
          this.placeList = result.tips;
        } else if (status == 'no_data' || status == 'error') {
          this.showPlane();
        }
        console.log(result);
      })
    }, 400);//防抖动

  }
  selectAddress(obj) {//选择查询的地址
    this.placeSearch.setCity(obj.adcode); //关键字城市查询
    this.placeSearch.search(obj.name, (status, result) => {
      this.showPlane()
      if (status == 'complete') {
        this.addessList = result.poiList.pois;
        this.map.setCenter(this.addessList[0].location);
      } else if (status == 'no_data' || status == 'error') {
      }
    }); //关键字查询

  }
  addessList: any;
  selectLoc() {//查询中心点地址
    this.placeSearch.searchNearBy('', this.map.getCenter(), 0, (status, result) => {
      if (status == 'complete') {
        this.addessList = result.poiList.pois;
      } else if (status == 'no_data' || status == 'error') {
      }
    });

  }
  planeFlg: boolean;
  showPlane() {//显示搜索记录     
    this.planeFlg = !this.planeFlg;
  }
  viewMessages(obj?) {//选中
    this.viewCtrl.dismiss(obj);
    /*{
      address: "红荔路2012号",
      distance: 100,
      id: "B02F37USFB",
      location: {
        M: 114.091229,
        O: 22.550909,
        lat: 22.550909,
        lng: 114.091229
      },
      name: "凤凰楼(圣廷苑店)",
      shopinfo: "0",
      tel: "0755-82076688;0755-82076338",
      type: "餐饮服务;中餐厅;海鲜酒楼|餐饮服务;中餐厅;综合酒楼",
    }*/
  }
}
