import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistinfoPage } from './registinfo';

@NgModule({
  declarations: [
    RegistinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(RegistinfoPage),
  ],
  exports: [
    RegistinfoPage
  ]
})
export class RegistinfoPageModule {}
