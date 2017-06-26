import { Injectable } from '@angular/core';
import { HttpService } from "../../providers/http.service";
import { NativeService } from "../../providers/NativeService";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Observable } from "rxjs";
/*
  Generated class for the LoginServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class LoginService {

  constructor(private httpService: HttpService, public native: NativeService, private camera: Camera) {

  }
  getUserByUUid(uuid): Observable<Response> {//根据uuid查询用户信息
    let requestInfo = {
      url: "person/getPersonByUUId",
      mobileUUid: uuid,
      hideloading: true
    }
    return Observable.create((observer) => {
      this.httpService.post(requestInfo.url, requestInfo).subscribe(
        data => {
          try {
            let res = data.json()
            observer.next(res);
          } catch (error) {
            observer.error(error);
          }
        },
        err => observer.error(err)
      );
    })
  }

  processIDcard = function (fileURL) {  //从服务器端获取来的身份证信息
    this.native.showLoading('身份自动识别中...');
    let requestInfo = {
      url: "/processID/IDCard",
      fileURL: fileURL,
      hideloading: true
    }
    return Observable.create((observer) => {
      this.httpService.post(requestInfo.url, requestInfo).subscribe(
        data => {
          try {
            let res = data.json()
            observer.next(res);
          } catch (error) {
            observer.error(error);
          }
          this.native.hideLoading();
        },
        err => {
          this.native.hideLoading();
          observer.error(err);
        }
      );
    })
  }
  registered(person) {//注册用户
    let requestInfo = {
      'url': "/person/add",
      'name': person.name,
      'alias': person.alias,
      'title': person.title,
      'mobile': person.mobile,
      'age': person.age,
      'pwd': person.pwd
    }
    return Observable.create((observer) => {
      this.httpService.post(requestInfo.url, requestInfo).subscribe(
        data => {
          try {
            let res = data.json()
            observer.next(res);
          } catch (error) {
            observer.error(error);
          }
        },
        err => {
          observer.error(err);
        }
      );
    })
  }
  openCamera(callbank) {//打开相机
    let options: CameraOptions = {
      // Some common settings are 20, 50, and 100
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      correctOrientation: true, //Corrects Android orientation quirks
      targetWidth:240,
      targetHeight:151,
    }
    this.camera.getPicture(options).then((imageData) => {
    // imageData is either a base64 encoded string or a file URI
    // If it's base64:
      alert(imageData);
    }, (err) => {
    // Handle error
      alert('开启相机报错'+err.toString());
    });
  }

}
