import { Injectable } from '@angular/core';
import { HttpService } from "../../providers/http.service";
import { NativeService } from "../../providers/NativeService";
import 'rxjs/add/operator/toPromise';
import { debuglog } from 'util';
@Injectable()
export class MapService {
  constructor(private httpService: HttpService, public native: NativeService) {

  }
  uploadCurLoc(loc,address) {//上传用户当前位置
    let reqinfo = {
      url: 'locations/add',
      bind_id: this.native.UserSession&&this.native.UserSession._id+'',
      bind_type:'0',
      address:address,
      lat:loc[1],
      lon:loc[0],
      create_time:Math.round(new Date().getTime()/1000),
      hideloading: true
    }
    this.httpService.post(reqinfo.url, reqinfo).subscribe(
      data => {
        try {
          let res= data.json();
          console.log('上传当前用户位置成功');
        } catch (error) {
          console.log('上传当前用户位置失败');
        }
      },
      err => { console.log('上传当前用户位置失败'); }
    );
  }
  getDeptPerson() {//查询部门人员列表
    let reqinfo = {
      url: 'people/latlon',
      department_id: this.native.UserSession&&this.native.UserSession.department_sub,
      hideloading: true
    }
    return new Promise((resolve, reject) => {
      this.httpService.post(reqinfo.url, reqinfo).subscribe(
        data => {
          try {
            let res = data.json();
            const userArr = data.json().info.filter(obj => {
              return !obj.status && obj._id !==this.native.UserSession._id
            })
            resolve(res.info);
          } catch (error) {
            reject(error);
          }
        },
        err => { reject(err); }
      );
    });

  }
  getcameraposition() {//获取摄像头位置
    let reqinfo = {
      url: 'maproute/getcameraposition',
      hideloading: true
    }
    return new Promise((resolve, reject) => {
      this.httpService.post(reqinfo.url, reqinfo).subscribe(
        data => {
          try {
            let res = data.json();
            resolve(res.info);
          } catch (error) {
            reject(error);
          }
        },
        err => { reject(err); }
      );
    });
  }
   geteventposition() {//获取待办事件点位置
    let reqinfo = {
      url: 'event/list',
      start_index: '0', 
      length: '10000', 
      department_id: this.native.UserSession&&this.native.UserSession.department_sub,
      hideloading: true
    }
    return new Promise((resolve, reject) => {
      this.httpService.post(reqinfo.url, reqinfo).subscribe(
        data => {
          try {
            let res = data.json();
            resolve(res.info.list);
          } catch (error) {
            reject(error);
          }
        },
        err => { reject(err); }
      );
    });
  }
  getspotarea() {//获取网格区域
    let reqinfo = {
      url: '/region/list',
      hideloading: true,
      start_index: '0', 
      length: '10000', 
      department_id:this.native.UserSession&&this.native.UserSession.department_sub
    }
    return new Promise((resolve, reject) => {
      this.httpService.post(reqinfo.url, reqinfo).subscribe(
        data => {
          try {
            let res = data.json();
            const regionArr = res.info.list.filter(obj => {
              return !obj.status
            })
            resolve(regionArr);
          } catch (error) {
            reject(error);
          }
        },
        err => { reject(err); }
      );
    });
  }
  getareaperson() {//获取区域管理人员
    let reqinfo = {
      url: '/personfacilities/GetPersonForId',
      hideloading: true,
      start_index: '0', 
      length: '10000', 
      department_id:this.native.UserSession&&this.native.UserSession.department_sub
    }
    return new Promise((resolve, reject) => {
      this.httpService.post(reqinfo.url, reqinfo).subscribe(
        data => {
          try {
            let res = data.json();
            let classleb = res.info.classname;
            let list = res.info.list;
            list.forEach(element => {
              classleb.forEach(cl => {
                if(element.class == cl.class){
                  element.class = cl.name;
                }
                if(element.status == cl.status){
                  element.status = cl.name;
                }
              });
              element.position = [element.lng,element.lat]
            });
            resolve(list);
          } catch (error) {
            reject(error);
          }
        },
        err => { reject(err); }
      );
    });
  }
  getconstruct() {//获取区域管理设施
    let reqinfo = {
      url: '/personfacilities/GetFacilitiesForId',
      hideloading: true,
      start_index: '0', 
      length: '10000', 
      department_id:this.native.UserSession&&this.native.UserSession.department_sub
    }
    return new Promise((resolve, reject) => {
      this.httpService.post(reqinfo.url, reqinfo).subscribe(
        data => {
          try {
            let res = data.json();
            let classleb = res.info.classname;
            let list = res.info.list;
            list.forEach(element => {
              classleb.forEach(cl => {
                if(element.class == cl.class){
                  element.class = cl.name;
                }
                if(element.status == cl.status){
                  element.status = cl.name;
                }
              });
              element.position = [element.lng,element.lat]
            });
            resolve(list);
          } catch (error) {
            reject(error);
          }
        },
        err => { reject(err); }
      );
    });
  }
}