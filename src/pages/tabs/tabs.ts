import { Component } from '@angular/core';

import { IonicPage, Events } from "ionic-angular";

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
    constructor(public events: Events) {

    }
    ionViewDidEnter() {
        this.events.subscribe('tab:readnum', (msg) => {
            this.readnum++;
        });
        this.events.subscribe('tab:delnum', (num) => {
            this.readnum -= num;
        });
    }
}
