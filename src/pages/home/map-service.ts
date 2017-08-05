import { Injectable } from '@angular/core';
import { HttpService } from "../../providers/http.service";
import { NativeService } from "../../providers/NativeService";
import 'rxjs/add/operator/toPromise';
@Injectable()
export class MapService {
  constructor(private httpService: HttpService, public native: NativeService) {

  }
  uploadCurLoc(loc) {//上传用户当前位置
    let reqinfo = {
      url: 'person/addlocation',
      personid: this.native.UserSession&&this.native.UserSession._id,
      curlocation: {
        positioningdate: new Date(),
        SRS: '4321',
        geolocation: loc
      },
      hideloading: true
    }
    this.httpService.post(reqinfo.url, reqinfo).subscribe(
      data => {
        try {
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
      url: 'maproute/getworkmateinfo',
      _id: this.native.UserSession&&this.native.UserSession._id,
      hideloading: true
    }
    return new Promise((resolve, reject) => {
      this.httpService.post(reqinfo.url, reqinfo).subscribe(
        data => {
          try {
            let res = data.json();
            resolve(res.success);
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
            resolve(res.success);
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
      url: 'maproute/geteventposition',
      hideloading: true
    }
    return new Promise((resolve, reject) => {
      this.httpService.post(reqinfo.url, reqinfo).subscribe(
        data => {
          try {
            let res = data.json();
            resolve(res.success);
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
      url: 'maproute/getspotarea',
      hideloading: true
    }
    return new Promise((resolve, reject) => {
      this.httpService.post(reqinfo.url, reqinfo).subscribe(
        data => {
          try {
            let res = data.json();
            resolve(res.success);
          } catch (error) {
            reject(error);
          }
        },
        err => { reject(err); }
      );
    });
  }
}