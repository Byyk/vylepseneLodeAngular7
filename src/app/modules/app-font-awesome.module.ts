import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faAngleLeft, faAngleRight, faBolt, faCrosshairs, faRocket} from '@fortawesome/free-solid-svg-icons';
import {faFacebook, faGoogle, faTwitter, faRocketchat, faSuperpowers} from '@fortawesome/free-brands-svg-icons';
import {faCompass, faLifeRing} from '@fortawesome/free-regular-svg-icons';

library.add(
    faGoogle,
    faFacebook,
    faTwitter,
    faAngleLeft,
    faAngleRight,
    faRocketchat,
    faRocket,
    faCompass,
    faSuperpowers,
    faLifeRing,
    faBolt,
    faCrosshairs
);

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        FontAwesomeModule
    ],
    exports: [
        FontAwesomeModule
    ]
})
export class AppFontAwesomeModule {
    constructor(){

    }
}
