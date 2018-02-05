import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApprovalPage } from './approval';

@NgModule({
  declarations: [
    ApprovalPage,
  ],
  imports: [
    IonicPageModule.forChild(ApprovalPage),
  ],
  exports: [
    ApprovalPage
  ]
})
export class ApprovalPageModule {}
