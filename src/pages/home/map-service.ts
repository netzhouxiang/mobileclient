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
      personid: this.native.UserSession.curUserId,
      curlocation: {
        positioningdate: new Date(),
        SRS: '4321',
        geolocation: [loc.lng, loc.lat]
      }
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
      _id: this.native.UserSession._id,
    }
    return new Promise((resolve,reject) => {
      this.httpService.post(reqinfo.url, reqinfo).subscribe(
        data => {
          try {
            let res = data.json();
            resolve(res);
          } catch (error) {
            this.native.showToast(error);
            reject(error);
          }
        },
        err => { reject(err); }
      );
    });

  }
}