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
                //扩展参数
                for (var i = 0; i < this.falvlist.length; i++) {
                    for (var y = 0; y < this.falvlist[i].lawlist.length; y++) {
                        this.falvlist[i].lawlist[y] = {
                            value: this.falvlist[i].lawlist[y],
                            checked: false
                        };
                    }
                }
            });
        }
    }
    select_ck(law) {
        law.checked = !law.checked;
    }
    ionViewDidLoad() { }
    //选择返回
    select() {
        this.dismiss(this.falvlist);
    }
    dismiss(data?) {
        this.viewCtrl.dismiss(data);
    }
}
