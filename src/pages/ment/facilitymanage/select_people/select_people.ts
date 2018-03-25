import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ActionSheetController,ModalController,ViewController } from 'ionic-angular';
import { NativeService } from "../../../../providers/NativeService";
import { MapService } from "../../../home/map-service";
import { MentService } from "../../ment.service";
import { HttpService } from "../../../../providers/http.service";
/**
 * Generated class for the RegistinfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-select_people',
    template:  `<ion-header>
    <ion-navbar>
        <ion-title>人员选择</ion-title>
        <ion-buttons right>
            <button ion-button full tappable (click)="viewMessages()">关闭</button>
        </ion-buttons>
    </ion-navbar>
</ion-header>
<ion-content padding-bottom>
        <ion-searchbar placeholder="搜索" [(ngModel)]="searchKey"></ion-searchbar>
        <ion-list *ngFor="let item of deptUserlist" no-lines>
            <ion-list-header *ngIf="!searchKey">
                {{item.dept.name}}
            </ion-list-header>
            <ng-container *ngFor="let user of item.user">
                <ion-item-sliding *ngIf="showChat(user.name)" tappable no-lines>
                    <ion-item (click)="viewMessages(user)">
                        <h2>{{user.name}}</h2>
                        <p>{{ user.role_name }}</p>
                    </ion-item>
                </ion-item-sliding>
            </ng-container>
        </ion-list>
</ion-content>`})
export class select_people {
    searchKey: string = "";
    public deptUserlist = [];
    public deptUserlist_show = [];
    public isLoad = false;
    constructor(public navCtrl: NavController, public navParams: NavParams,private native: NativeService,public actionSheetCtrl: ActionSheetController,public viewCtrl: ViewController,public mapService: MapService,private httpService: HttpService,public modalCtrl: ModalController,public mentservice: MentService) {
        console.log('加载人员')
        this.dept_user();
    }

    showChat(name) {
        return name.indexOf(this.searchKey) > -1;
    }
    //部门与用户数据展示处理
    dept_user() {
        if (this.native.DeptList && this.native.DeptList.length > 0 && this.native.UserList && this.native.UserList.length > 0) {
            this.native.DeptList.forEach(_dept => {
                var m = {
                    dept: _dept,
                    user: []
                };
                this.native.UserList.forEach(_user => {
                    if (_user.department_id == _dept._id) {
                        _user.username = "yzwg_" + _user._id;
                        m.user.push(_user);
                    }
                });
                this.deptUserlist.push(m);
            });
            this.isLoad = true;
        }
        if (!this.isLoad) {
            setTimeout(() => {
                this.dept_user();
            }, 1000);
        }
    }
    viewMessages(obj?) {
        this.viewCtrl.dismiss(obj);
      }
}