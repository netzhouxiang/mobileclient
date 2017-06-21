import { Component } from '@angular/core';

import {IonicPage} from "ionic-angular";

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

  constructor() {

  }
}
