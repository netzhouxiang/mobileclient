import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, ModalController, Events } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
import { HttpService } from "../../providers/http.service";
import { Geolocation } from '@ionic-native/geolocation';
import { MapService } from "./map-service";
import { Utils } from "../../providers/Utils";
import { ThrowStmt } from '@angular/compiler/src/output/output_ast';
import _ from 'lodash'
import { retry } from 'rxjs/operator/retry';
// import { setInterval } from 'timers';
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
  timeer: any;
  timeer2: any;
  filsFlg: boolean = true;
  is_dingwei = true;
  settingArr = {
    isTs: true,//是否显示同事
    isDbaj: true,//是否显示待办案件
    isWgqy: true,//是否显示网格区域
    isSxt: true,//是否显示摄像头
  }
  constructor(public navCtrl: NavController, public modalCtrl: ModalController,
    public native: NativeService, private httpService: HttpService,
    private geolocation: Geolocation, private mapService: MapService,
    public events: Events,
  ) {

  }
  initMap() {
    try {
      this.map = new AMap.Map(this.map_container.nativeElement, {
        view: new AMap.View2D({//创建地图二维视口的
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
      this.native.myStorage.get('settingArr').then((val) => {//获取用户配置并初始化
        if (val) {
          this.settingArr = val;
        }
        // 30秒刷新一次数据
        if (this.native.UserSession) {
          this.judgmentSetting();
          setInterval(() => {
            this.updateMapInfo();
          }, 30000);
        }
      });
    } catch (error) {
      this.native.showToast('地图加载失败');
    }

  }
  ionViewDidLoad() {
    this.initMap();
  }
  ionViewDidEnter() {
    //通知首页进行区域定位 区域对象area  
    if (this.map) {
      this.events.subscribe('home:quyudw', (area) => {
        try {
          let arr = area.geometry[0].coordinates;
          let position = [arr[0], arr[1]];
          if (position.length) {
            this.map.setZoomAndCenter(14, position);
          }
        } catch (error) {
        }
      });
    }
  }
  locationPostion = {
    oldloc: new Array(),
    newloc: new Array(),
    address: '未知'
  };
  geolocations: any;
  getGeolocation() {//定位当前位置
    this.map.plugin('AMap.Geolocation', () => {
      this.geolocations = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位,默认:true
        timeout: 10000,          //超过10秒后停止定位,默认：无穷大
        GeoLocationFirst: true,
        showButton: false,
        buttonOffset: new AMap.Pixel(10, 30),//定位按钮与设置的停靠位置的偏移量,默认：Pixel(10, 20)
        showCircle: true,        //定位成功后用圆圈表示定位精度范围,默认：true
        panToLocation: false,     //定位成功后将定位到的位置作为地图中心点,默认：true
        buttonPosition: 'LB',
      });
      this.map.addControl(this.geolocations);
      this.geolocations.getCurrentPosition();
      // this.timeer2 = setInterval(() => {
      //   this.geolocations.getCurrentPosition();
      // }, 5000)
      let countTimes = 0;
      this.timeer = setInterval(() => {//上传位置信息
        if (this.is_dingwei) {
          countTimes++;
          let newloc = this.locationPostion.newloc.toString();
          let oldloc = this.locationPostion.oldloc.toString();
          // if (newloc != oldloc || countTimes > 28) {//位置不变则4分钟上传一次,
            // countTimes = 0
          this.locationPostion.oldloc = this.locationPostion.newloc;
          this.native.Currentposition = this.locationPostion.newloc;//把当前定位点存到全局变量中
          if(this.locationPostion.newloc.length) {
            this.mapService.uploadCurLoc(this.locationPostion.newloc, this.locationPostion.address);
          }
          // }
        }
      }, 10000);
      AMap.event.addListener(this.geolocations, 'complete', (data) => {
        setTimeout(() => { // 定时查询当前位置
          this.geolocations.getCurrentPosition();
        }, 5000)
        this.is_dingwei = true;
        if (!this.locationPostion.newloc) {
          this.locationPostion.newloc = [data.position.lng, data.position.lat];
          this.map.setZoomAndCenter(16, data.position);
        } else {
          this.locationPostion.newloc = [data.position.lng, data.position.lat];
        }
        if (this.userGetLocFlg) {
          this.userGetLocFlg = false;
          this.map.setZoomAndCenter(16, data.position);
        }
        // 通过经纬度进行转码
        var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
        });
        geocoder.getAddress(this.locationPostion.newloc, (status, result) =>{
          if (status === 'complete' && result.info === 'OK') {
            this.locationPostion.address = result.regeocode.formattedAddress
            this.native.myStorage.set('mentPostion', {
              loc: this.locationPostion.newloc,
              name: result.regeocode.formattedAddress,
              text: result.regeocode.formattedAddress,
            });
          }
        });  
      });//返回定位信息
      AMap.event.addListener(this.geolocations, 'error', (data) => {
        this.pgGeolocation();//定位失败时调用插件定位
      });      //返回定位出错信息
    });

  }
  userGetLocFlg: boolean = false;
  userGetLoc() {
    this.userGetLocFlg = true;
    this.geolocations.getCurrentPosition();
  }
  pgGeolocation() {//定位插件定位
    var setMapCenter = (a, b) => {
      this.map.setZoomAndCenter(16, [a, b]);//设置地图的中心点和坐标
    }
    this.geolocation.getCurrentPosition().then((resp) => {
      setTimeout(() => { // 定时查询当前位置
        this.pgGeolocation();
      }, 5000)
      if (resp.coords) {
        if (!this.locationPostion.newloc) {
          this.locationPostion.newloc = [resp.coords.longitude, resp.coords.latitude];
          setMapCenter(resp.coords.longitude, resp.coords.latitude);
        }
        if (this.userGetLocFlg) {
          this.userGetLocFlg = false;
          setMapCenter(resp.coords.longitude, resp.coords.latitude);
        }
      }
      this.is_dingwei = true;
      // 通过经纬度进行转码
      var geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: "all"
      });
      geocoder.getAddress(this.locationPostion.newloc, (status, result) =>{
        if (status === 'complete' && result.info === 'OK') {
          this.locationPostion.address = result.regeocode.formattedAddress
          this.native.myStorage.set('mentPostion', {
            loc: this.locationPostion.newloc,
            name: result.regeocode.formattedAddress,
            text: result.regeocode.formattedAddress,
          });
        }
      }); 
    }).catch((error) => {
      this.is_dingwei = false;
      if (this.filsFlg) {
        this.filsFlg = false
        this.native.showToast('定位失败,请检查是否打开GPS定位');
      }
      // clearInterval(this.timeer)
      // clearInterval(this.timeer2)
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
    const addMark = (marker) =>{
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
        offset: new AMap.Pixel(-12, -36),
        extData: marker
      });
      if (type == 'person') {
        mark.setLabel({//label默认蓝框白底左上角显示,样式className为：amap-marker-label
          offset: new AMap.Pixel(0, 30),//修改label相对于maker的位置
          content: marker.name
        });
      }
      this.settingObj[type].push(mark);//存储对应点标记
      mark.content = getinfoWindow(type, marker, this.native);
      mark.on('click', (e) => {
        this.typeObj = marker;
        this.typeObj.type = type;
        this.showModel(mark);
      });
    }
    if(this.updateFlg) {
      const updateMarkArr = this.settingObj[type]
      const oldMark = []
      updateMarkArr.forEach(element => {
        oldMark.push(element.Qi.extData)
      });
      //取出差异部分
      const arr = _.differenceWith(markers , oldMark , _.isEqual);
      //对差异部分重新处理
      arr.forEach(element => {
        let flg = false;
        updateMarkArr.forEach(els => {
          if(els.Qi.extData._id == element._id) { //找到对应的mark
            flg = true
            els.setPosition(element.position);
            els.setExtData(element);
            els.on('click', (e) => {
              console.log(element)
              els.content = getinfoWindow(type, element, this.native);
              this.typeObj = element;
              this.typeObj.type = type;
              this.showModel(els);
            });
          }
        });
        if(!flg){ //未找到则添加
          addMark(element)
        }
      });
      return
    }
    markers.forEach((marker) => {
      addMark(marker)
    });
    this.modelFlg = false;
  }
  setPolygon(data) {//绘制多边行
    let polygonArr = data;//多边形覆盖物节点坐标数组
    const colorArr = {}
    const addPolygon = (element) =>{
      if (!colorArr[element.department_id]) {
        colorArr[element.department_id] = '#' + Math.floor(Math.random() * 0xffffff).toString(16)
      }
      let polygon = new AMap.Polygon({
        path: element.latlon_list,//设置多边形边界路径
        strokeColor: "#FF33FF", //线颜色
        strokeOpacity: 0.2, //线透明度
        strokeWeight: 3,    //线宽
        extData: element,
        fillColor: colorArr[element.department_id], //随机填充色
        fillOpacity: 0.35//填充透明度
      });
      polygon.setMap(this.map);
      polygon.on('click', () => {
        this.native.showToast(element.name);
      });
      // let simgad= new AMap.PolyEditor(this.map, polygon);
      // simgad.open();
      this.settingObj['area'].push(polygon);
    }
    if(this.updateFlg) {
      const updatePolygonArr = this.settingObj['area']
      const oldPolygon = []
      updatePolygonArr.forEach(element => {
        oldPolygon.push(element.Qi.extData)
      });
      //取出差异部分
      const arr = _.differenceWith(polygonArr , oldPolygon , _.isEqual);
      //对差异部分重新处理
      console.log('qian',updatePolygonArr)
      arr.forEach(element => {
        let flg = false;
        
        updatePolygonArr.forEach(els => {
          if(els.getExtData()._id == element._id) { //找到对应的polygon
            flg = true
            //多边形无法更新数据，暂不更新，可能版本问题
            // els.setOptions({
            //   path:element.latlon_list
            // });
            // els.setExtData(element);
            // els.on('click', (e) => {
            //   this.native.showToast(element.name);
            // });
          }
        });
        if(!flg){ //未找到则添加
          addPolygon(element)
        }
      });
      console.log('hou',updatePolygonArr)
      return
    }
    polygonArr.forEach((marker) => {
      addPolygon(marker)
    });
  }
  typeObj: any;
  goOtherPage() {
    if (this.typeObj.type == 'person') {
      if (this.typeObj._id == this.native.UserSession._id) {
        this.native.showToast('抱歉,不能与自己沟通');
        return;
      }
      this.navCtrl.push('ChatUserPage', { username: 'yzwg_' + this.typeObj._id });
    } else if (this.typeObj.type == 'case') {
      let arr = this.settingObj['person'];
      let psflg = false;
      this.showModel();
      arr.forEach(element => {
        if (element.Qi.extData._id == this.typeObj.user_id) {//定位到经办人用户位置
          psflg = true;
          this.typeObj = element.Qi.extData;
          this.typeObj.type = 'person';
          this.showModel(element);
          this.map.setZoomAndCenter(16, this.typeObj.position);
          return;
        }

      });
      if (psflg) {

      } else {
        if (this.typeObj._id == this.native.UserSession._id) {
          this.native.showToast('抱歉,不能与自己沟通');
          return;
        }
        this.native.showToast('经办人离线中~');
      }

    } else if (this.typeObj.type == 'camera') {

    }

  }
  getInfoWindows(type, data, native?) {
    let str = '';
    if (type == 'person') {
      str = `<div class="fz-12 pd-b6 border-b">
                <span class="ma-r6">${data.name}</span><span class="c-ff7b57 ma-r6">${data.states == 1 ? '在线' : '离线'}</span>
                <span class="c-58d281"></span>
            </div>
            <div class="m-ct" >
                <img src="${native.appServer.file}/images/user/${data.location.user_id}.jpg" onerror="this.onerror=null;this.src='/assets/img/avatar.png'" />
                 定位时间：${data.date}
                <br><br>
                位置：${data.location.address}
                <br><br>
                <span class="c-063185">点击可发送消息</span>
            </div>`;
    } else if (type == 'case') {
      str = `<div class="fz-12 pd-b6 border-b">
                <span class="ma-r6">${data.name}</span>
            </div>
            <div class="fz-12">
                <p>发生地点：${data.address}</p>
                <p>经办人：${data.username}</p>
                <p>操作时间：${data.date}</p>
                <p>状态：${(data.is_unfilled > 0 && data.is_unaudited == 0) ? '进行中' : '正在进行审核'}</p>
            </div>`;
    } else if (type == 'camera') {
      str = `<div class="fz-12 pd-b6 border-b">
                <span class="ma-r6">${data.name}</span><span class="c-ff7b57 ma-r6">类型：${data.type}</span>
            </div>
            <div class="cansf">
            <video src="http://www.zhangxinxu.com/study/media/cat.mp4" width="100%" height="100%" controls autobuffer></video>
            </div>`;

    }

    return str;
  }
  infowind: any;
  modelFlg: boolean;
  updateFlg:boolean;
  showModel(data?) {
    if (data) {
      if (this.typeObj.type == 'case') {
        // this.getEventLasePerson(); 
        this.infowind = this.getInfoWindows(this.typeObj.type, this.typeObj);
        this.modelFlg = true;
      } else {
        this.infowind = data.content;
        this.modelFlg = true;
      }
    } else {
      this.modelFlg = false;
    }
  }
  getEventLasePerson() {//查询当前事件操作人
    this.httpService.post('mobilegrid/geteventlaseperson', { 'eventID': this.typeObj._id, }).subscribe(
      reult => {
        try {
          let res = reult.json();
          this.typeObj.lastperson = res.success.lastperson;
          this.typeObj.lastTime = res.success.lastTime;
          this.typeObj.status = res.success.status;
          this.typeObj.step = res.success.step;
        } catch (error) {
          this.native.showToast(error);
        }
        this.infowind = this.getInfoWindows(this.typeObj.type, this.typeObj);
        this.modelFlg = true;
      },
      err => { }
    );
  }
  goPeslist() {//跳转到附近人员
    let profileModal = this.modalCtrl.create('PeslistPage', { personList: this.personList });
    // this.map.remove(this.settingObj.person);
    // this.settingObj.person = new Array();
    // this.setSetting('person', true);    
    profileModal.onDidDismiss(obj => {
      if (obj) {
        let arr = this.settingObj['person'];
        arr.forEach(element => {
          if (element.Qi.position.lng == obj.position[0]) {
            this.showModel(element);
            this.typeObj = obj;
            this.typeObj.type = 'person';
            return;
          }
        });
        this.map.setZoomAndCenter(12, obj.position);
      }
    });
    profileModal.present();
    //  this.map.setZoomAndCenter(14, [116.205467, 39.907761]);
  }
  menuClose() {
    this.native.myStorage.set('settingArr', this.settingArr);
    this.judgmentSetting();
  }
  personList: any;
  setSetting(type, isFlg) {//设置点标记和网格
    if (isFlg) {
      if (type == "person") {
        this.mapService.getDeptPerson().then(res => {
          let arr = [];
          for (let i in res) {
            res[i].position = [res[i].location.lon + Math.random() * 0.0001, res[i].location.lat + Math.random() * 0.0001]
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
          this.personList = arr
          this.setMarkers(type, perArr, this.getInfoWindows);
        }, err => {
        });
      } else if (type == "case") {
        this.mapService.geteventposition().then(res => {
          let arr = res
          for (let i in arr) {
            arr[i].position = [arr[i].lon, arr[i].lat]
            arr[i].date = Utils.dateFormat(new Date(arr[i].happen_time * 1000), 'yyyy-MM-dd HH:mm');
          }
          this.setMarkers(type, arr, this.getInfoWindows, 'assets/img/map/zuob2.png')
        }, err => {

        });
      } else if (type == "area") {
        this.mapService.getspotarea().then(res => {
          if (res) {
            this.setPolygon(res);
          }
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
    this.updateFlg = false;
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
    // if (this.settingArr.isSxt) {
    //   if (!this.settingObj.camera.length) {
    //     this.setSetting('camera', true);
    //   }
    // } else {
    //   if (this.settingObj.camera.length) {
    //     this.map.remove(this.settingObj.camera);
    //     this.settingObj.camera = new Array();
    //   }
    // }
  }
  updateMapInfo() {//更新地图的数据
    this.updateFlg = true;
    if (this.settingArr.isTs) {
      this.setSetting('person', true);
    }
    if (this.settingArr.isDbaj) {
      this.setSetting('case', true);
    }
    if (this.settingArr.isWgqy) {
      this.setSetting('area', true);
    }
    // if (this.settingArr.isSxt) {
    //     this.setSetting('camera', true);
    // } else {
    //   if (this.settingObj.camera.length) {
    //     this.map.remove(this.settingObj.camera);
    //     this.settingObj.camera = new Array();
    //   }
    // }
  }
}
