import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, AlertController} from 'ionic-angular';
import {NativeService} from "../../../../providers/NativeService";
import {HttpService} from "../../../../providers/http.service";

/**
 * Generated class for the UpcomingPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-approval',
  templateUrl: 'approval.html',
})
export class ApprovalPage {
  pet: string = "leave";

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, public navParams: NavParams, public native: NativeService, private httpService: HttpService, public viewCtrl: ViewController,) {
    console.log(this.navParams.get('type'))
    if (this.navParams.get('type')) {
      this.pet = this.navParams.get('type')
      console.log(this.pet)
    }
    console.log(this.pet)
  }

  doRefresh(refresher) {// 做刷新处理
    this.ionViewDidLoad();
    setTimeout(() => {
      refresher.complete();
    }, 3000);
  }

  ionViewDidLoad() {
    this.getpersonEvent();
    this.getpersonEvent_hb();
  }

  LeaveList = new Array();
  LeaveList_hb = new Array();

  getpersonEvent_hb() {
    let requestInfo = {
      url: "changeshifts/list",
      length: 10000,
      start_index: "0",
      change_state: '0',
      department_id: this.native.UserSession.department_sub,
    }
    this.httpService.post(requestInfo.url, requestInfo).subscribe(data => {
      try {
        let res = data.json();
        if (res.code == 200) {
          this.LeaveList_hb = res.info.list;
        } else {
          this.native.showToast(res.info);
        }
      } catch (error) {
        this.native.showToast(error);
      }
    }, err => {
      this.native.showToast(err);
    });
  }

  getpersonEvent() {
    let requestInfo = {
      url: "leaves/list",
      length: 10000,
      start_index: "0",
      approval_state: '0',
      department_id: this.native.UserSession.department_sub,
    }
    this.httpService.post(requestInfo.url, requestInfo).subscribe(data => {
      try {
        let res = data.json();
        if (res.code == 200) {
          this.LeaveList = res.info.list;
        } else {
          this.native.showToast(res.info);
        }
      } catch (error) {
        this.native.showToast(error);
      }
    }, err => {
      this.native.showToast(err);
    });
  }

  //hb
  approve_hb(msg, state) {
    let confirm = this.alertCtrl.create({
      title: "提示",
      message: "您确定要" + (state == 1 ? "同意" : "拒绝") + "该换班申请?",
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'cus-cancel',
          handler: () => {
          }
        },
        {
          text: '确定',
          handler: () => {
            let requestInfo = {
              url: "changeshifts/update",
              _id: msg._id,
              change_state: state
            }
            this.httpService.post(requestInfo.url, requestInfo).subscribe(data => {
              try {
                let res = data.json();
                if (res.code == 200) {
                  this.native.showToast("操作成功");
                  this.getpersonEvent_hb();
                } else {
                  this.native.showToast(res.info);
                }
              } catch (error) {
                this.native.showToast(error);
              }
            }, err => {
              this.native.showToast(err);
            });
          }
        }
      ]
    });
    confirm.present();
  }

  //qj
  approve(msg, state) {
    let confirm = this.alertCtrl.create({
      title: "提示",
      message: "您确定要" + (state == 1 ? "同意" : "拒绝") + "该请假申请?",
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'cus-cancel',
          handler: () => {
          }
        },
        {
          text: '确定',
          handler: () => {
            this.native.showLoading();
            let requestInfo = {
              url: "leaves/update",
              _id: msg._id,
              approval_state: state,
              approval_user_id: this.native.UserSession._id
            }
            this.httpService.post(requestInfo.url, requestInfo).subscribe(data => {
              try {
                let res = data.json();
                if (res.code == 200) {
                  this.native.showToast("审批成功");
                  this.getpersonEvent();
                } else {
                  this.native.showToast(res.info);
                }
              } catch (error) {
                this.native.showToast(error);
              }
            }, err => {
              this.native.showToast(err);
            });
          }
        }
      ]
    });
    confirm.present();
  }
}
