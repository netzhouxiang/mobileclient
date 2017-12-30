import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectUserPage } from './selectuser';

@NgModule({
    declarations: [
        SelectUserPage,
    ],
    imports: [
        IonicPageModule.forChild(SelectUserPage),
    ],
    exports: [
        SelectUserPage
    ]
})
export class SelectUserPageModule { }
