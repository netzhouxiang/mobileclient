import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { select_people } from './select_people';

@NgModule({
  declarations: [
    select_people,
  ],
  imports: [
    IonicPageModule.forChild(select_people),
  ],
  exports: [
    select_people
  ]
})
export class select_peopleModule {}
