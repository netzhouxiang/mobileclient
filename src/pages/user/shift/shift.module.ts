import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShiftPage } from './shift';

@NgModule({
  declarations: [
    ShiftPage,
  ],
  imports: [
    IonicPageModule.forChild(ShiftPage),
  ],
  exports: [
    ShiftPage
  ]
})
export class ShiftPageModule {}
