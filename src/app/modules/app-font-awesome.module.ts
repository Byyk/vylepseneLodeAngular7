import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFacebook, faGoogle, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faAngleLeft, faAngleRight, faComment } from '@fortawesome/free-solid-svg-icons';

library.add(
    faFacebook,
    faGoogle,
    faTwitter,
    faAngleLeft,
    faAngleRight,
    faComment
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
export class AppFontAwesomeModule { }
