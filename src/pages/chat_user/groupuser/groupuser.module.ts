import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupUserPage } from './groupuser';

@NgModule({
    declarations: [
        GroupUserPage,
    ],
    imports: [
        IonicPageModule.forChild(GroupUserPage),
    ],
    exports: [
        GroupUserPage
    ]
})
export class GroupUserPageModule { }
