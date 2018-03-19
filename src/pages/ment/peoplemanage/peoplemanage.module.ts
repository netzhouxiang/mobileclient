import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { peopleManage } from './peoplemanage';

@NgModule({
  declarations: [
    peopleManage,
  ],
  imports: [
    IonicPageModule.forChild(peopleManage),
  ],
  exports: [
    peopleManage
  ]
})
export class peopleManageModule {}
