import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddqunPage } from './addqun';

@NgModule({
    declarations: [
        AddqunPage,
    ],
    imports: [
        IonicPageModule.forChild(AddqunPage),
    ],
    exports: [
        AddqunPage
    ]
})
export class AddqunPageModule { }
