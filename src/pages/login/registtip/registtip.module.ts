import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisttipPage } from './registtip';

@NgModule({
  declarations: [
    RegisttipPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisttipPage),
  ],
  exports: [
    RegisttipPage
  ]
})
export class RegisttipPageModule {}
