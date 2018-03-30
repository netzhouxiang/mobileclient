import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { selectpersonPage } from './selectperson';

@NgModule({
  declarations: [
    selectpersonPage,
  ],
  imports: [
    IonicPageModule.forChild(selectpersonPage),
  ],
  exports: [
    selectpersonPage
  ]
})
export class selectpersonPageModule {}
