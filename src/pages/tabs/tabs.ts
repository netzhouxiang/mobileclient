import { Component, ViewChild } from '@angular/core';
import { IonicPage, Events } from "ionic-angular";
import { ChatService } from "../../providers/chat-service";
import { Tabs } from "ionic-angular";
@IonicPage({
    name: 'TabsPage'
})
@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    @ViewChild('mainTabs') tabs: Tabs;
    tab1Root: any = 'HomePage';
    tab2Root: any = 'MentPage';
    tab3Root: any = 'ChatPage';
    tab4Root: any = 'UserPage';
    // tab3Root: any = 'ContactPage';
    readnum: number = 0;
    readnum_per: number = 0;
    constructor(public events: Events, private chatser: ChatService) {
        //this.changred();
    }

    ionViewDidEnter() {
        this.events.subscribe('tab:readnum', (num) => {
            this.readnum = num;
        });
    }
}
