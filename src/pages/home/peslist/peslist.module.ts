import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PeslistPage } from './peslist';

@NgModule({
  declarations: [
    PeslistPage,
  ],
  imports: [
    IonicPageModule.forChild(PeslistPage),
  ],
  exports: [
    PeslistPage
  ]
})
export class PeslistPageModule {}
