import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { MentService } from "../ment.service";

@IonicPage()
@Component({
    selector: 'page-case',
    templateUrl: 'case.html',
})
export class casePage {
    eventlist = [];
    type = 0;//0 案件上报 1:案件审核 2:今日代办
    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public mentservice: MentService) {
        this.type = parseInt(this.navParams.get("type"));
    }
    gopage(event) {
        let tz = "";
        switch (this.type) {
            case 0:
                tz = "CaseReportPage";
                break;
            case 1:
                tz = "verifyPage";
                break;
            case 2:
                tz = "UpcomingPage";
                break;
        }
        this.navCtrl.push(tz, { event: event });
    }
    ionViewDidLoad() {
        this.mentservice.getAllAbstracttype().subscribe(data => {
            this.eventlist = data.json().info;
        });
    }
}
