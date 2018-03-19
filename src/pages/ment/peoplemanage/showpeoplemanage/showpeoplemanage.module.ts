import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { showpeoplemanage } from './showpeoplemanage';

@NgModule({
  declarations: [
    showpeoplemanage,
  ],
  imports: [
    IonicPageModule.forChild(showpeoplemanage),
  ],
  exports: [
    showpeoplemanage
  ]
})
export class showpeoplemanageModule {}
