import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScanloginPage } from './scanlogin';

@NgModule({
  declarations: [
    ScanloginPage,
  ],
  imports: [
    IonicPageModule.forChild(ScanloginPage),
  ],
  exports: [
    ScanloginPage
  ]
})
export class ScanloginPageModule {}
