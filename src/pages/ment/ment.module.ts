import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MentPage } from './ment';

@NgModule({
  declarations: [
    MentPage,
  ],
  imports: [
    IonicPageModule.forChild(MentPage),
  ],
  exports: [
    MentPage
  ]
})
export class MentPageModule {}
