import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { addManage } from './addmanage';

@NgModule({
  declarations: [
    addManage,
  ],
  imports: [
    IonicPageModule.forChild(addManage),
  ],
  exports: [
    addManage
  ]
})
export class addManageModule {}
