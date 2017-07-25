import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { rejectPage } from './reject';

@NgModule({
  declarations: [
    rejectPage,
  ],
  imports: [
    IonicPageModule.forChild(rejectPage),
  ],
  exports: [
    rejectPage
  ]
})
export class rejectPageModule {}
