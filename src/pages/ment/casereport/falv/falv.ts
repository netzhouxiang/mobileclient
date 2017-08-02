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
    isshow=false;
    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public mentservice: MentService) {
        
    }
    select_ck(law) {
        law.checked = !law.checked;
    }
    ionViewDidLoad() {

        var deptid = this.navParams.get("deptid");
        if (deptid) {
            this.mentservice.getdepartmentlaw(deptid).subscribe(data => {
                if (!data.json().success) {
                    this.mentservice.chatser.native.showToast("暂未查到相关法律法规")
                    return false;
                }
                this.isshow=true;
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
    //选择返回
    select() {
        this.dismiss(this.falvlist);
    }
    dismiss(data?) {
        this.viewCtrl.dismiss(data);
    }
}
