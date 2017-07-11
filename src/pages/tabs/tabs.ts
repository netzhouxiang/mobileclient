import { Component } from '@angular/core';

import { IonicPage, Events } from "ionic-angular";
import { ChatService } from "../../providers/chat-service";

@IonicPage()
@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    tab1Root: any = 'HomePage';
    tab2Root: any = 'MentPage';
    tab3Root: any = 'ChatPage';
    tab4Root: any = 'UserPage';
    // tab3Root: any = 'ContactPage';
    readnum: number = 0;
    readnum_per: number = 0;
    qjred: number = 0;
    hbred: number = 0;
    constructor(public events: Events, private chatser: ChatService) {
        //this.changred();
    }
    changred() {
        this.qjred = 0;
        this.hbred = 0;
        this.chatser.getMsgListTs().then(res => {
            if (!res) {
                res = [];
            }
            
            var msglistTs = res;
            for (var i = 0; i < msglistTs.length; i++) {
                if (msglistTs[i].type == "0" && msglistTs[i].cl == "0") {
                    this.qjred++;
                }
                if (msglistTs[i].type == "1" && msglistTs[i].cl == "0") {
                    this.hbred++;
                }
            }
            this.readnum_per = this.qjred + this.hbred;
            //刷新个人中心
            this.events.publish('user:sxred', {
                qjred: this.qjred,
                hbred: this.hbred
            });
        });
    }
    ionViewDidEnter() {
        this.events.subscribe('tab:readnum', (msg) => {
            this.readnum++;
        });
        this.events.subscribe('tab:delnum', (num) => {
            this.readnum -= num;
        });
        this.events.subscribe('tab:readnum_per', (num) => {
            this.changred();
        });
        this.events.subscribe('tab:delnum_per', (num) => {
            this.readnum_per -= num;
        });
    }
}
