import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
import { HttpService } from "../../providers/http.service";
import { Geolocation } from '@ionic-native/geolocation';
import { MapService } from "./map-service";
import { Utils } from "../../providers/Utils";
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

  }
  initMap() {
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
    setInterval(() => {//上传位置信息
      let newloc = this.locationPostion.newloc.toString();
      let oldloc = this.locationPostion.oldloc.toString();
      if (newloc != oldloc) {//位置不变则不用上传
        this.locationPostion.oldloc = this.locationPostion.newloc;
        this.mapService.uploadCurLoc(this.locationPostion.newloc);
      }
    }, 10000);
    this.native.myStorage.get('settingArr').then((val) => {//获取用户配置并初始化
      if (val) {
        this.settingArr = val;
      }
      if (this.native.UserSession) {
        this.judgmentSetting();
      }


    });
  }
  ionViewDidLoad() {
    this.initMap();
  }
  locationPostion = {
    oldloc: new Array(),
    newloc: new Array()
  };
  getGeolocation() {//定位当前位置
    this.map.plugin('AMap.Geolocation', () => {
      let geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        GeoLocationFirst: true,
        buttonOffset: new AMap.Pixel(10, 30),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
        buttonPosition: 'LB'
      });
      this.map.addControl(geolocation);
      geolocation.getCurrentPosition();
      setInterval(() => {
        geolocation.getCurrentPosition();
      }, 10000)
      AMap.event.addListener(geolocation, 'complete', (data) => {
        if (!this.locationPostion.newloc) {
          this.locationPostion.newloc = [data.position.lng, data.position.lat];
          this.map.setCenter(data.position);
        } else {
          this.locationPostion.newloc = [data.position.lng, data.position.lat];
        }

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
        if (!this.locationPostion.newloc) {
          this.locationPostion.newloc = [resp.coords.longitude, resp.coords.latitude];
          setMapCenter(resp.coords.longitude, resp.coords.latitude);
        }

      }
    }).catch((error) => {
      // this.native.showToast('定位失败');
    });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {//监听定位
      if (data.coords) {
        this.locationPostion.newloc = [data.coords.longitude, data.coords.latitude];
      }

    });
  }

  setMarkers(type, data?, getinfoWindow?, icon: string = 'assets/img/map/personicon.png') {//设置点标记
    let markers = data;
    markers.forEach((marker) => {
      if (!marker.position || !marker.position.length) {
        return;
      }
      let mark = new AMap.Marker({
        map: this.map,
        icon: new AMap.Icon({
          size: new AMap.Size(30, 50),  //图标大小
          image: icon,
          imageOffset: new AMap.Pixel(0, 0)
        }),
        position: marker.position,
        offset: new AMap.Pixel(-12, -36)
      });
      this.settingObj[type].push(mark);//存储对应点标记
      mark.content = getinfoWindow(type, marker);
      mark.on('click', (e) => {
        this.showModel(mark);
        this.typeObj = marker;
        this.typeObj.type = type;
      });
      mark.emit('click', { target: marker });
    });
    this.modelFlg = false;

  }
  setPolygon(data) {//绘制多边行
    let polygonArr = data;//多边形覆盖物节点坐标数组


    polygonArr.forEach(element => {
      let result = [];
      for (let i = 0, len = element.geometry.coordinates.length; i < len; i += 2) {
        result.push(element.geometry.coordinates.slice(i, i + 2));
      }
      let polygon = new AMap.Polygon({
        path: element.geometry.coordinates,//设置多边形边界路径
        strokeColor: "#FF33FF", //线颜色
        strokeOpacity: 0.2, //线透明度
        strokeWeight: 3,    //线宽
        fillColor: '#' + Math.floor(Math.random() * 0xffffff).toString(16), //随机填充色
        fillOpacity: 0.35//填充透明度
      });
      polygon.setMap(this.map);
      // let simgad= new AMap.PolyEditor(this.map, polygon);
      // simgad.open();
      this.settingObj['area'].push(polygon);
    });

  }
  typeObj: any;
  goOtherPage() {
    if (this.typeObj.type == 'person') {
      this.navCtrl.push('ChatUserPage', this.typeObj );
    } else if (this.typeObj.type == 'case') {
      this.native.showToast('正在开发中...');
    } else if (this.typeObj.type == 'camera') {
      
    }

  }
  getInfoWindows(type, data) {
    let str = '';
    if (type == 'person') {
      str = `<div class="fz-12 pd-b6 border-b">
                <span class="ma-r6">${data.name}</span><span class="c-ff7b57 ma-r6">${data.status == 1 ? '在线' : '离线'}</span>
                <span class="c-58d281">直线距离300m</span>
            </div>
            <div class="m-ct">
                <img src="http://tpc.googlesyndication.com/simgad/5843493769827749134" />
                 最后定位时间：2017-07-02 07:21
                <br><br>
                <span class="c-063185">点击可发送消息</span>
            </div>`;
    } else if (type == 'case') {
      str = `<div class="fz-12 pd-b6 border-b">
                <span class="ma-r6">${data.name}</span>
            </div>
            <div class="fz-12">
                <p>坐标位置：${data.position}</p>
                <p>更新事件：${Utils.dateFormat(new Date(data.newer), 'yyyy-MM-dd hh:mm')}</p>
            </div>`;
    } else if (type == 'camera') {
      str = `<div class="fz-12 pd-b6 border-b">
                <span class="ma-r6">${data.name}</span><span class="c-ff7b57 ma-r6">类型：${data.type}</span>
            </div>
            <div class="cansf">
            <video src="${data.videoUrl}" width="100%" height="100%" controls autobuffer></video>
            </div>`;

    }

    return str;
  }
  infowind: any;
  modelFlg: boolean;
  showModel(data?) {
    if (data) {
      this.infowind = data.content;
      this.modelFlg = true;
    } else {
      this.modelFlg = false;
    }
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
  setSetting1(type, isFlg) {//设置点标记和网格
    // 测试数据
    let a1 = [{ _id: "同事ID", name: "张三", position: [113.894373, 22.555997], status: 1 }];
    let a2 = [{ _id: "事件ID", name: "无照经营", position: [113.907591, 22.547753], newer: "更新时间" }];
    let a3 = [{ "_id": "网格区域ID", name: "南六环", geometry: { coordinates: [[113.907248, 22.566935], [113.924242, 22.558375], [113.909307, 22.542521], [113.886476, 22.550765]], type: "Polygon" } }];
    let a4 = [{ position: [113.884932, 22.565667], videoUrl: "video.sohu.com", name: "保平村路口", type: "球形摄像头", protocol: "rstp" }];
    if (isFlg) {
      if (type == "person") {
        this.mapService.getDeptPerson().then(res => {
          this.setMarkers(type, res, this.getInfoWindows)
        }, err => {
          this.setMarkers(type, a1, this.getInfoWindows)
        });
      } else if (type == "case") {
        this.mapService.geteventposition().then(res => {
          this.setMarkers(type, res, this.getInfoWindows, 'assets/img/map/zuob2.png')
        }, err => {
          this.setMarkers(type, a2, this.getInfoWindows, 'assets/img/map/zuob2.png')
        });
      } else if (type == "area") {
        this.mapService.getspotarea().then(res => {
          this.setPolygon(res);
        }, err => {
          this.setPolygon(a3);
        })
      } else if (type == "camera") {
        this.mapService.getcameraposition().then(res => {
          this.setMarkers(type, res, this.getInfoWindows, 'assets/img/map/zuob3.png')
        }, err => {
          this.setMarkers(type, a4, this.getInfoWindows, 'assets/img/map/zuob3.png')
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
        this.settingObj.person = new Array();
      }
    }
    if (this.settingArr.isDbaj) {
      if (!this.settingObj.case.length) {
        this.setSetting('case', true);
      }
    } else {
      if (this.settingObj.case.length) {
        this.map.remove(this.settingObj.case);
        this.settingObj.case = new Array();
      }
    }
    if (this.settingArr.isWgqy) {
      if (!this.settingObj.area.length) {
        this.setSetting('area', true);
      }
    } else {
      if (this.settingObj.area.length) {

        this.map.remove(this.settingObj.area);
        this.settingObj.area = new Array();
      }
    }
    if (this.settingArr.isSxt) {
      if (!this.settingObj.camera.length) {
        this.setSetting('camera', true);
      }
    } else {
      if (this.settingObj.camera.length) {
        this.map.remove(this.settingObj.camera);
        this.settingObj.camera = new Array();
      }
    }
  }
}
