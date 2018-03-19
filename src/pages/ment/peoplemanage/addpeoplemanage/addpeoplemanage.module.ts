import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { addPeopleManage } from './addpeoplemanage';

@NgModule({
  declarations: [
    addPeopleManage,
  ],
  imports: [
    IonicPageModule.forChild(addPeopleManage),
  ],
  exports: [
    addPeopleManage
  ]
})
export class addPeopleManageModule {}
