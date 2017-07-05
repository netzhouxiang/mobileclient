import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportedPage } from './reported';

@NgModule({
  declarations: [
    ReportedPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportedPage),
  ],
  exports: [
    ReportedPage
  ]
})
export class ReportedPageModule {}
