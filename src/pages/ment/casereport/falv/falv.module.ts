import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { falvPage } from './falv';

@NgModule({
    declarations: [
        falvPage,
    ],
    imports: [
        IonicPageModule.forChild(falvPage),
    ],
    exports: [
        falvPage
    ]
})
export class falvPageModule { }
