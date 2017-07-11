import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TongzhiPage } from './tongzhi';

@NgModule({
  declarations: [
      TongzhiPage,
  ],
  imports: [
    IonicPageModule.forChild(TongzhiPage),
  ],
  exports: [
    TongzhiPage
  ]
})
export class TongzhiPageModule {}
