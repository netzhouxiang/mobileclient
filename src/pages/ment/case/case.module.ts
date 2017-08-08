import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { casePage } from './case';

@NgModule({
    declarations: [
        casePage,
    ],
    imports: [
        IonicPageModule.forChild(casePage),
    ],
    exports: [
        casePage
    ]
})
export class casePageModule { }
