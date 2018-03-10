import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { areaManage } from './areamanage';

@NgModule({
  declarations: [
    areaManage,
  ],
  imports: [
    IonicPageModule.forChild(areaManage),
  ],
  exports: [
    areaManage
  ]
})
export class areaManageModule {}
