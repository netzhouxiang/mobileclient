import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { stepPage } from './step';

@NgModule({
  declarations: [
    stepPage,
  ],
  imports: [
    IonicPageModule.forChild(stepPage),
  ],
  exports: [
    stepPage
  ]
})
export class stepPageModule {}
