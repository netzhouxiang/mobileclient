import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ChatService } from "../../providers/chat-service";
import { HttpService } from "../../providers/http.service";

@IonicPage()
@Component({
    selector: 'page-user',
    templateUrl: 'user.html',
})
export class UserPage {
    userInfo: any;
    sitInfo={
        app:0,
        up:0,
        mi:0,
    };
    params = { type: 'update' };
    root: any;
    constructor(public navCtrl: NavController,private httpService: HttpService, public events: Events, public modalCtrl: ModalController, public navParams: NavParams, private native: NativeService, private barcodeScanner: BarcodeScanner, private chatser: ChatService) {
        this.root = this.native.appServer.file;
        this.userInfo = this.native.UserSession;
        console.log(this.navParams)
    }
    ionViewDidEnter() {

    }
    opentongzhi(){
        let modal = this.modalCtrl.create('TongzhiPage', { });
      modal.onDidDismiss(data => {
        if(data&&data.page){
          this.goOtherPage(data.page)
        }
      });
        modal.present();
    }
    ionViewDidLoad() {
        this.httpService.post('tongji/my',{}).subscribe(data=>{
            try {
              let res=data.json();
              console.log(res)
              if(res.code != 200){
                this.native.showToast(res.info);
              }else{
                  this.sitInfo = res.info;
              }
            } catch (error) {
              this.native.showToast(error);
            }
        },err=>{
        this.native.showToast(err);
        });
        console.log('ionViewDidLoad UserPage');
    }
    goOtherPage(pagename, data = {}) {//去目标页面
        this.navCtrl.push(pagename, data);
    }
    scanLogin() {
        let options =
            {
                preferFrontCamera: false, // iOS and Android
                showFlipCameraButton: true, // iOS and Android
                showTorchButton: true, // iOS and Android
                torchOn: false, // Android, launch with the torch switched on (if available)
                prompt: "Place a barcode inside the scan area", // Android
                resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
               // formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
                disableAnimations: true, // iOS
                disableSuccessBeep: false // iOS
            };
        this.barcodeScanner.scan(options).then((barcodeData) => {
            let [result,format,cancelled]=[barcodeData.text, barcodeData.format, barcodeData.cancelled];
            if(result && format==='QR_CODE'){
                let modal = this.modalCtrl.create('ScanloginPage', barcodeData);
                modal.present();
            }else {
                if(cancelled){
                   this.native.showToast('取消扫描~');
                    return;
                }
                this.native.showToast('请识别正常格式的二维码');
            }

            // Success! Barcode data is here
        }, (err) => {
            this.native.showToast(err);
            // An error occurred
        });
    }
}
