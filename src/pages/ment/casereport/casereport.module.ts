import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CaseReportPage } from './casereport';

@NgModule({
  declarations: [
    CaseReportPage,
  ],
  imports: [
    IonicPageModule.forChild(CaseReportPage),
  ],
  exports: [
    CaseReportPage
  ]
})
export class CaseReportPageModule {}
