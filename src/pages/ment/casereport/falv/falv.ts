import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { MentService } from "../../ment.service";

@IonicPage()
@Component({
    selector: 'page-falv',
    templateUrl: 'falv.html',
})
export class falvPage {
    falvlist = [];
    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public mentservice: MentService) {
        var deptid = navParams.get("deptid");
        if (deptid) {
            this.mentservice.getdepartmentlaw(deptid).subscribe(data => {
                this.falvlist = data.json().success;
                console.log(this.falvlist)
            });
        }
    }
    ionViewDidLoad() { }
    //选择返回
    select() {
        for (var i = 0; i < this.falvlist.length; i++) {
            if (this.falvlist[i]) {

            }
        }
        this.dismiss();
    }
    dismiss() {
        this.viewCtrl.dismiss();
    }
}
