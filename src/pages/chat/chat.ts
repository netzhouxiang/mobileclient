import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpService } from "../../providers/http.service";
import { NativeService } from "../../providers/NativeService";
/**
 * Generated class for the ChatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-chat',
    templateUrl: 'chat.html',
})
export class ChatPage {
    ChatUserPage: any = 'ChatUserPage';
    public deptlist = new Array();
    constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpService, public native: NativeService) {
        //获取当前登录用户的部门结构人员
        this.loaduser(this.native.UserSession.departments);
    }
    loaduser(dept) {
        let requestInfo = {
            url: "department/getAllpersonsByDepartIdOneStep",
            _id: dept[0].department,//部门id
            hideloading: true
        }
        this.httpService.post(requestInfo.url, requestInfo).subscribe(
            data => {
                this.deptlist.push(data.json());
                dept.splice(0, 1);
                if (dept.length > 0) {
                    this.loaduser(dept);
                }
            },
            err => console.error(err)
        );
    }
    ionViewDidLoad() {
        console.log(this.deptlist);
    }
    go(type, phone) {
        location.href = type == 0 ? "sms:" : "tel:" + phone;
    }
}
