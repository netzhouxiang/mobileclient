import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
import { HttpService } from "../../providers/http.service";
import { Geolocation } from '@ionic-native/geolocation';
import { MapService } from "./map-service";
/**
 * Generated class for the HomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var AMap;
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild('map_container') map_container: ElementRef;
  map: any;//地图对象
  settingObj = {
    "person": [],//用于存储对应点标记
    "case": [],
    "area": [],
    "camera": []
  }
  settingArr = {
    isTs: true,//是否显示同事
    isDbaj: true,//是否显示待办案件
    isWgqy: true,//是否显示网格区域
    isSxt: true,//是否显示摄像头
  }
  constructor(public navCtrl: NavController, public modalCtrl: ModalController,
    public native: NativeService, private httpService: HttpService,
    private geolocation: Geolocation, private mapService: MapService,
    private elementRef: ElementRef
  ) {
    this.native.myStorage.get('settingArr').then((val) => {//获取用户配置并初始化
      if (val) {
        this.settingArr = val;
      }
      if (this.native.UserSession) {
        this.judgmentSetting();
      }


    });
  }
  ionViewDidEnter() {
    this.map = new AMap.Map(this.map_container.nativeElement, {
      view: new AMap.View2D({//创建地图二维视口
        zoom: 10, //设置地图缩放级别
        rotateEnable: true,
        showBuildingBlock: true
      })
    });
    //地图中添加地图操作ToolBar插件
    this.map.plugin(["AMap.ToolBar"], () => {
      let toolBar = new AMap.ToolBar(); //设置定位位标记为自定义标记
      this.map.addControl(toolBar);
    });
    this.getGeolocation();
  }
  ionViewDidLoad() {
    //当地图页面加载完成，启动消息轮循 这时候用户已登录
    // this.chatser.getUserNoRead();
    console.log('ionViewDidLoad HomePage');
  }
  getGeolocation() {//定位当前位置
    this.map.plugin('AMap.Geolocation', () => {
      let geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        buttonOffset: new AMap.Pixel(10, 30),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
        zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
        buttonPosition: 'LB'
      });
      this.map.addControl(geolocation);
      geolocation.getCurrentPosition();
      AMap.event.addListener(geolocation, 'complete', (data) => {
        console.log(data);
      });//返回定位信息
      AMap.event.addListener(geolocation, 'error', (data) => {
        this.pgGeolocation();//定位失败时调用插件定位
        console.log(data);
      });      //返回定位出错信息
    });

  }
  pgGeolocation() {//定位插件定位
    var setMapCenter = (a, b) => {
      this.map.setCenter([a, b]);//设置地图的中心点和坐标
    }
    this.geolocation.getCurrentPosition().then((resp) => {
      if (resp.coords) {
        setMapCenter(resp.coords.longitude, resp.coords.latitude);
      }
    }).catch((error) => {
      this.native.showToast('定位失败');
    });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {//监听定位
      if (data.coords) {
        setMapCenter(data.coords.longitude, data.coords.latitude);
      }

    });
  }
  setMarkers(type, data?, getinfoWindow?, icon: string = 'assets/img/map/personicon.png') {//设置点标记
    let markers = data;
    let infoWindow = new AMap.InfoWindow({
      isCustom: false,
      closeWhenClickMap: true,
      comtent: ''
    });
    //
    markers.forEach((marker) => {

      let mark = new AMap.Marker({
        map: this.map,
        icon: new AMap.Icon({
          size: new AMap.Size(30, 50),  //图标大小
          image: icon,
          imageOffset: new AMap.Pixel(0, 0)
        }),
        position: [marker.position[0], marker.position[1]],
        offset: new AMap.Pixel(-12, -36)
      });
      this.settingObj[type].push(mark);//存储对应点标记
      mark.content = getinfoWindow(type, marker);
      mark.on('click', (e) => {
        infoWindow.setContent(mark.content);
        infoWindow.open(this.map, mark.getPosition());
      });
      mark.emit('click', { target: marker });
    });
    try {
      this.map.clearInfoWindow();//首次加载会出现一个窗体，这里移除掉
    } catch (error) {

    }

  }
  setPolygon(data) {//绘制多边行
    let polygonArr = data;//多边形覆盖物节点坐标数组
    polygonArr.forEach(element => {
      let polygon = new AMap.Polygon({
        path: element.geometry.coordinates,//设置多边形边界路径
        strokeColor: "#FF33FF", //线颜色
        strokeOpacity: 0.2, //线透明度
        strokeWeight: 3,    //线宽
        fillColor: "#1791fc", //填充色
        fillOpacity: 0.35//填充透明度
      });
      polygon.setMap(this.map);
      this.settingObj['area'].push(polygon);
    });

  }

  gocontact(data) {
    this.navCtrl.push('ChatUserPage', {
      data: data
    })
  }
  getInfoWindows(type, data) {
    let str = '';
    if (type == 'person') {
      str = `<div class="border-b" style="font-size:13px">
            ${data.name}<span class="c-ff7b57 ma-l5">${data.status == 1 ? '在线' : '离线'}</span><span class="c-063185 ma-l5">直线距离500m</span>
        </div>
        <div class="info-middle">
            <img  src="http://tpc.googlesyndication.com/simgad/5843493769827749134">最后定位时间：2017-07-02 07:21
            <br>
            <a href="javascript:void(0)" (click)="gocontact(${data})" >点击可发送消息</a>
        </div>`;
    } else if (type == 'case') {
      str = `<div class="border-b" style="font-size:13px">
            ${data.name}
        </div>
        <div class="info-middle">
            坐标位置：${data.position}
            <br>
            ${data.newer}<br>
        </div>`;
    } else if (type == 'camera') {
      str = `<div class="border-b" style="font-size:13px">
            ${data.name}
        </div>
        <div class="info-middle">
           类型：${data.type}
            <br>
        </div>`;
    }

    return str;
  }

  goPeslist() {//跳转到附近人员
    let profileModal = this.modalCtrl.create('PeslistPage', {});
    profileModal.onDidDismiss(position => {
      if (position) {
        this.map.setZoomAndCenter(20, position, this.getInfoWindows);
      }
    });
    profileModal.present();
    //  this.map.setZoomAndCenter(14, [116.205467, 39.907761]);
  }
  menuClose() {
    this.native.myStorage.set('settingArr', this.settingArr);
    this.judgmentSetting();
  }
  setSetting(type, isFlg) {//设置点标记和网格
    if (isFlg) {
      if (type == "person") {
        this.mapService.getDeptPerson().then(res => {
          this.setMarkers(type, res, this.getInfoWindows)
        }, err => {
        });
      } else if (type == "case") {
        this.mapService.geteventposition().then(res => {
          this.setMarkers(type, res, this.getInfoWindows, 'assets/img/map/zuob2.png')
        }, err => {
        });
      } else if (type == "area") {
        this.mapService.getspotarea().then(res => {
          this.setPolygon(res);
        }, err => {
        })
      } else if (type == "camera") {
        this.mapService.getcameraposition().then(res => {
          this.setMarkers(type, res, this.getInfoWindows, 'assets/img/map/zuob3.png')
        }, err => {
        });
      }

    } else {
      this.map.remove(this.settingObj[type]);
    }
  }
  judgmentSetting() {//根据设置信息设置标记和网格区域
    if (this.settingArr.isTs) {
      if (!this.settingObj.person.length) {
        this.setSetting('person', true);
      }
    } else {
      if (this.settingObj.person.length) {
        this.map.remove(this.settingObj.person);
      }
    }
    if (this.settingArr.isDbaj) {
      if (!this.settingObj.case.length) {
        this.setSetting('case', true);
      }
    } else {
      if (this.settingObj.case.length) {
        this.map.remove(this.settingObj.case);
      }
    }
    if (this.settingArr.isWgqy) {
      if (!this.settingObj.area.length) {
        this.setSetting('area', true);
      }
    } else {
      if (this.settingObj.area.length) {

        this.map.remove(this.settingObj.area);
      }
    }
    if (this.settingArr.isSxt) {
      if (!this.settingObj.camera.length) {
        this.setSetting('camera', true);
      }
    } else {
      if (this.settingObj.camera.length) {
        this.map.remove(this.settingObj.camera);
      }
    }
  }
}
