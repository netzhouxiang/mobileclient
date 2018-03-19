import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { addupdatemanage } from './addupdatemanage';

@NgModule({
  declarations: [
    addupdatemanage,
  ],
  imports: [
    IonicPageModule.forChild(addupdatemanage),
  ],
  exports: [
    addupdatemanage
  ]
})
export class addupdatemanageModule {}
