/**
 * 公共化
 */
import { Injectable } from '@angular/core';
import { ToastController, LoadingController, Platform, Loading, AlertController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { Storage } from '@ionic/storage';
declare var cordova: any;
@Injectable()
export class NativeService {
    private fileTransfer: TransferObject;
    private loading: Loading;
    private loadingIsOpen: boolean = false;
    //环境
    public appServer = {
        //nodejs服务器接口地址
        node: "http://39.108.229.49:82/",
        //静态资源服务器地址
        file: "http://39.108.229.49:83/"
    }
    myStorage: Storage;
    //当前登录用户对象 默认为null 如果为null 则需要扫描身份证登录 否则自动登录
    public UserSession: any;
    //所有部门集合
    public DeptList: any;
    //所有用户集合
    public UserList: any;
    constructor(private platform: Platform,
        private toastCtrl: ToastController,
        private alertCtrl: AlertController,
        private camera: Camera,
        private file: File,
        private fileOpener: FileOpener,
        private loadingCtrl: LoadingController,
        private transfer: Transfer,
        public storage: Storage, ) {
        this.myStorage = storage;
        this.fileTransfer = this.transfer.create();
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
            position: 'bottom',
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
    //更新下载APK copy
    downapk(apk_down, apk_name) {
        if (this.isAndroid()) {
            let alertx = this.alertCtrl.create({
                title: '下载进度：0%',
                enableBackdropDismiss: false,
                buttons: ['后台下载']
            });
            alertx.present();
            const apk = this.file.externalApplicationStorageDirectory + apk_name + '.apk'; //apk保存的目录
            this.fileTransfer.download(apk_down, apk).then(() => {
                alertx.dismiss();
                this.fileOpener.open(apk, 'application/vnd.android.package-archive').then(() => { }, (error) => {
                    alert(JSON.stringify(error));
                });
            }, (error) => {
                alert(JSON.stringify(error));
                alertx.dismiss();
            });
            this.fileTransfer.onProgress((event: ProgressEvent) => {
                let num = Math.floor(event.loaded / event.total * 100);
                if (num === 100) {
                    alertx.dismiss();
                } else {
                    alertx.setTitle('下载进度：' + num + '%');
                }
            });
        }
    }
    /**
   * 是否真机环境
   * @return {boolean}
   */
    isMobile(): boolean {
        return this.platform.is('mobile') && !this.platform.is('mobileweb');
    }

    /**
     * 是否android真机环境
     * @return {boolean}
     */
    isAndroid(): boolean {
        return this.isMobile() && this.platform.is('android');
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
            //setTimeout(() => {//最长显示10秒
            //    this.loadingIsOpen && this.loading.dismiss();
            //    this.loadingIsOpen = false;
            //}, 10000);
        }
    };

    /**
     * 关闭loading
     */
    hideLoading(): void {
        this.loadingIsOpen && this.loading.dismiss();
        this.loadingIsOpen = false;
    };
    //文件转64
    tobase64(url: string, path: string) {
        return this.file.readAsDataURL(path ? path : cordova.file.externalRootDirectory, url)
    }
    /**
    * 使用cordova-plugin-camera获取照片的base64
    * @param options
    * @return {Promise<T>}
    */
    getPicture = (options) => {
        return new Promise((resolve, reject) => {
            this.camera.getPicture(Object.assign({
                sourceType: this.camera.PictureSourceType.CAMERA,//图片来源,CAMERA:拍照,PHOTOLIBRARY:相册
                destinationType: this.camera.DestinationType.DATA_URL,//返回值格式,DATA_URL:base64,FILE_URI:图片路径
                quality: 90,//保存的图像质量，范围为0 - 100
                allowEdit: true,//选择图片前是否允许编辑
                encodingType: this.camera.EncodingType.JPEG,
                targetWidth: 800,//缩放图像的宽度（像素）
                targetHeight: 800,//缩放图像的高度（像素）
                saveToPhotoAlbum: false,//是否保存到相册
                correctOrientation: true//设置摄像机拍摄的图像是否为正确的方向
            }, options)).then((imageData) => {
                resolve(imageData);
            }, (err) => {
                console.log(err);
                err == 20 ? this.showToast('没有权限,请在设置中开启权限') : reject(err);
            });
        });
    };
    /**
    * 通过图库获取照片
    * @param options
    * @return {Promise<T>}
    */
    getPictureByPhotoLibrary = (options = {}) => {
        return new Promise((resolve) => {
            this.getPicture(Object.assign({
                sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
            }, options)).then(imageBase64 => {
                resolve(imageBase64);
            }).catch(err => {
                String(err).indexOf('cancel') != -1 ? this.showToast('取消选择图片', 1500) : this.showToast('获取照片失败');
            });
        });
    };
    /**
     * 通过拍照获取照片
     * @param options
     * @return {Promise<T>}
     */
    getPictureByCamera = (options = {}) => {
        return new Promise((resolve) => {
            this.getPicture(Object.assign({
                sourceType: this.camera.PictureSourceType.CAMERA
            }, options)).then(imageBase64 => {
                resolve(imageBase64);
            }).catch(err => {
                String(err).indexOf('cancel') != -1 ? this.showToast('取消拍照', 1500) : this.showToast('获取照片失败');
            });
        });
    };
    /**
    * 弹出信息
    * @param 消息内容
    */
    alert(msg: string, sucCallback?: Function, flg: boolean=true, btntxt: string = '确定', title: string = '提示', ): void {
        let alert = this.alertCtrl.create({
            title: title,
            message: msg,
            enableBackdropDismiss:flg,
            buttons: [
                {
                    text: btntxt,
                    handler: () => {
                        sucCallback && sucCallback();
                    }
                }]
        });
        alert.present();
    }
    /**
    * 弹出信息并确认
    * @param 消息内容
    */
    confirm(msg: string, sureCallback: Function, cancelCallback?: Function, title: string = '提示',cancel:string='取消',ok:string='确定'): void {
        let confirm = this.alertCtrl.create({
            title: title,
            message: msg,
            buttons: [
                {
                    text: cancel,
                    role: 'cancel',
                    cssClass: 'cus-cancel',
                    handler: () => {
                        cancelCallback && cancelCallback();
                    }
                },
                {
                    text: ok,
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
