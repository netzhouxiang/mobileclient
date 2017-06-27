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
declare var FileTransfer: any;
declare var FileUploadOptions: any;
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

  processIDcard = function (fileURL, callbank) {  //从服务器端获取来的身份证信息
    this.native.showLoading('身份自动识别中...');
    let requestInfo = {
      url: "/processID/IDCard",
      fileURL: fileURL,
      hideloading: true
    }
    this.httpService.post(requestInfo.url, requestInfo).subscribe(
      data => {
        try {
          let res = data.json()
          callbank && callbank(res);
        } catch (error) {
          this.native.showToast('身份证识别失败，请重试~');
        }
        this.native.hideLoading();
      },
      err => {
        this.native.showToast('身份证识别失败，请重试~');
        this.native.hideLoading();
      }
    );
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
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 240,
      targetHeight: 151,
    }
    this.native.getPicture(options).then((imageData) => {
      this.uploadIDCard(imageData, callbank);
    }, (err) => {
      this.native.showToast('调用相机失败');
    });
  }
  uploadIDCard(fileURL, callbank) {
    let options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
    options.mimeType = "image/jpg";
    //注意身份证识别只认jpg，
    let ft = new FileTransfer();
    this.native.showLoading('上传中...');
    ft.upload(fileURL, this.native.appServer.node+'filedirectupload/IDCard', data => {
      console.log(data);
      this.native.hideLoading();
      try {
        let res=JSON.parse(data.response);
        this.processIDcard(res.filename, callbank);
      } catch (error) {
        this.native.showToast('解析IDCard图片失败');
      }
    }, err => {
      console.log(err);
      this.native.showToast('上传文件失败');
      this.native.hideLoading();
    }, options);
  }
}
