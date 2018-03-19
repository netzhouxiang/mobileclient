import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { addupdatefacility } from './addupdatefacility';

@NgModule({
  declarations: [
    addupdatefacility,
  ],
  imports: [
    IonicPageModule.forChild(addupdatefacility),
  ],
  exports: [
    addupdatefacility
  ]
})
export class addupdatefacilityModule {}
