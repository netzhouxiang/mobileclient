import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { showmanagelist } from './showmanagelist';

@NgModule({
  declarations: [
    showmanagelist,
  ],
  imports: [
    IonicPageModule.forChild(showmanagelist),
  ],
  exports: [
    showmanagelist
  ]
})
export class showmanagelistModule {}
