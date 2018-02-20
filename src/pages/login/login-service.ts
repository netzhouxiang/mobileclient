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
      url: "people/uuid",
      uuid: uuid,
      key: '123123'
    }
    return Observable.create((observer) => {
      this.httpService.post(requestInfo.url, requestInfo).subscribe(
        data => {
          try {
            //该方法返回已校正新接口
            let res = data.json();
            if (res.code != 200) {
              observer.error(res.info);
            } else {
              observer.next(res.info);
            }

          } catch (error) {
            observer.error(error);
          }
        },
        err => observer.error(err)
      );
    })
  }
  processIDcard(FileData, callbank) {  //从服务器端获取来的身份证信息
    this.native.showLoading('身份自动识别中...');
    let requestInfo = {
      url: "people/identification",
      FileData: FileData,
      hideloading: true
    }
    this.httpService.post(requestInfo.url, requestInfo).subscribe(
      data => {
        try {
          let res = data.json();
          if (res.code != 200) {
            this.native.showToast(res.info);
          } else {
            callbank && callbank(res.info);
          }
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
    let requestInfo = Object.assign({
      'url': "people/register",
    }, person);
    return Observable.create((observer) => {
      this.httpService.post(requestInfo.url, requestInfo).subscribe(
        data => {
          try {
            let res = data.json();
            if (res.code != 200) {
              observer.error(res);
            } else {
              observer.next(res);
            }

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
      //新接口返回base64直接
      destinationType: this.camera.DestinationType.DATA_URL,
      mediaType: this.camera.MediaType.PICTURE,
      quality: 100,
      targetWidth: 700,
      targetHeight: 440
    }
    this.native.getPicture(options).then((imageData) => {
      this.processIDcard(imageData, callbank);
      //this.uploadIDCard(imageData, callbank);
    }, (err) => {
      this.native.showToast('调用相机失败');
    });
  }
  //该方法放弃，无需上传,新接口直接base64解析
  uploadIDCard(fileURL, callbank) {
    let options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
    options.mimeType = "image/jpg";
    //注意身份证识别只认jpg，
    let ft = new FileTransfer();
    this.native.showLoading('上传中...');
    ft.upload(fileURL, this.native.appServer.node + 'filedirectupload/IDCard', data => {
      console.log(data);
      this.native.hideLoading();
      try {
        let res = JSON.parse(data.response);
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
