import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewperPage } from './newper';

@NgModule({
  declarations: [
    NewperPage,
  ],
  imports: [
    IonicPageModule.forChild(NewperPage),
  ],
  exports: [
    NewperPage
  ]
})
export class NewperPageModule {}
