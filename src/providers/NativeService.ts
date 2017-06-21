/**
 * 公共化
 */
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { ToastController, LoadingController, Platform, Loading, AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
@Injectable()
export class NativeService {
  private loading: Loading;
  private loadingIsOpen: boolean = false;
  //服务器地址
  private appServer = {
    //nodejs服务器接口地址
    node: "http://120.76.228.172:2000/",
    //静态资源服务器地址
    file: "http://120.76.228.172:80/"
  }
  //当前登录用户对象 默认为null 如果为null 则需要扫描身份证登录 否则自动登录
  public UserSession = null;
  constructor(private platform: Platform,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private http: Http,
    private loadingCtrl: LoadingController) {
  }

  warn(info): void {
    console.log('%cNativeService/' + info, 'color:#e8c406');
  }
  /**
   * post
   * @param url 获取地址
   */
  post(url: string, body: any) {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let options = new RequestOptions({
      headers: headers
    });
    return new Promise((resolve, reject) => {
      this.http.post(this.appServer.node + url, body, options).map(res => res.json())
        .subscribe(data => resolve(data), err => reject(err))
    });
  }
  /**
   * 统一调用此方法显示loading
   * @param content 显示的内容
   */
  showLoading(content: string = ''): void {
    if (!this.loadingIsOpen) {
      this.loadingIsOpen = true;
      this.loading = this.loadingCtrl.create({
        content: content
      });
      this.loading.present();
      setTimeout(() => {//最长显示10秒
        this.loadingIsOpen && this.loading.dismiss();
        this.loadingIsOpen = false;
      }, 10000);
    }
  };

  /**
   * 关闭loading
   */
  hideLoading(): void {
    this.loadingIsOpen && this.loading.dismiss();
    this.loadingIsOpen = false;
  };
}
