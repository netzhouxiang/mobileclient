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
    public appServer = {
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
    /**
     * 统一调用此方法显示提示信息
     * @param message 信息内容
     * @param duration 显示时长
     */
    showToast(message: string = '操作完成', duration: number = 2000): void {
        this.toastCtrl.create({
            message: message,
            duration: duration,
            position: 'middle',
            cssClass: 'custoast',
            showCloseButton: false
        }).present();
    };
    /**
      * 请求数据处理
      * 
      * 
      */
    AjAxData(data, succallback?: Function, failcallback?: Function): void {
        try {
            let res = data.json();
            if (res) {
                succallback && succallback(res);
            } else {
                failcallback && failcallback(res);
            }
        } catch (error) {
            console.error(error);
            this.showToast(error);
        }
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
    /**
    * 弹出信息
    * @param 消息内容
    */
    alert(msg: string, sureCallback?: Function, cancelCallback?: Function, btntxt: string = '确定', title: string = '提示', ): void {
        let alert = this.alertCtrl.create({
            title: title,
            message: msg,
            buttons: [
                {
                    text: btntxt,
                    handler: () => {
                        sureCallback && sureCallback();
                    }
                }]
        });
        alert.present();
    }
    /**
    * 弹出信息并确认
    * @param 消息内容
    */
    confirm(msg: string, sureCallback: Function, cancelCallback?: Function, title: string = '提示'): void {
        let confirm = this.alertCtrl.create({
            title: title,
            message: msg,
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {
                        cancelCallback && cancelCallback();
                    }
                },
                {
                    text: '确定',
                    handler: () => {
                        sureCallback && sureCallback();
                    }
                }
            ]
        });
        confirm.present();
    }
    /**  
   * 获取指定的URL参数值  
   * URL:http://www.baidu.com/index?name=tyler  
   * 参数：paramName URL参数  
   * 调用方法:getParam("name","url")  
   * 返回值:tyler  
   */
    getParam(paramName, url) {
        let strReturn = "";
        let strHref = url.toLowerCase();
        if (strHref.indexOf("?") > -1) {
            let strQueryString = strHref.substr(strHref.indexOf("?") + 1).toLowerCase();
            let aQueryString = strQueryString.split("&");
            for (let iParam = 0; iParam < aQueryString.length; iParam++) {
                if (aQueryString[iParam].indexOf(paramName.toLowerCase() + "=") > -1) {
                    let aParam = aQueryString[iParam].split("=");
                    strReturn = aParam[1];
                    break;
                }
            }
        } else if (strHref.indexOf("&") > -1) {
            let strQueryString = strHref.substr(strHref.indexOf("&") + 1).toLowerCase();
            let aQueryString = strQueryString.split("&");
            for (let iParam = 0; iParam < aQueryString.length; iParam++) {
                if (aQueryString[iParam].indexOf(paramName.toLowerCase() + "=") > -1) {
                    let aParam = aQueryString[iParam].split("=");
                    strReturn = aParam[1];
                    break;
                }
            }
        }
        return strReturn;
    }
}
