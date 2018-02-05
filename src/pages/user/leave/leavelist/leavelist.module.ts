import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaveListPage } from './leavelist';

@NgModule({
  declarations: [
    LeaveListPage,
  ],
  imports: [
    IonicPageModule.forChild(LeaveListPage),
  ],
  exports: [
    LeaveListPage
  ]
})
export class LeaveListPageModule {}
