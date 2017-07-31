import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { imagePage } from './image';

@NgModule({
  declarations: [
    imagePage,
  ],
  imports: [
    IonicPageModule.forChild(imagePage),
  ],
  exports: [
    imagePage
  ]
})
export class imagePageModule {}
