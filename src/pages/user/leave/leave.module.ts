import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeavePage } from './leave';

@NgModule({
  declarations: [
    LeavePage,
  ],
  imports: [
    IonicPageModule.forChild(LeavePage),
  ],
  exports: [
    LeavePage
  ]
})
export class LeavePageModule {}
