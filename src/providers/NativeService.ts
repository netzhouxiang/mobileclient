/**
 * Created by yanxiaojun617@163.com on 12-27.
 */
import {Injectable} from '@angular/core';
import {ToastController, LoadingController, Platform, Loading, AlertController} from 'ionic-angular';
@Injectable()
export class NativeService {
  private loading: Loading;
  private loadingIsOpen: boolean = false;

  constructor(private platform: Platform,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController,
              private file: File,
              private loadingCtrl: LoadingController) {
  }

  warn(info): void {
    console.log('%cNativeService/' + info, 'color:#e8c406');
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
