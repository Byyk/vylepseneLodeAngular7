import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-tabs-nav',
    templateUrl: './tabs-nav.component.html',
    styleUrls: ['./tabs-nav.component.scss'],
    animations: [
        trigger('tabs', [
            state('tab1', style({
                left: '0px'
            })),
            state('tab2', style({
                left: '139px'
            })),
            transition('tab1 <=> tab2', [
                animate('0.3s')
            ])
        ])
    ]
})
export class TabsNavComponent implements OnInit {

    @Output()
    public stateChanged = new EventEmitter();

    navState = "tab1";

    constructor() { }

    ngOnInit() {
    }

    moveSlider(number: number){
        this.stateChanged.emit(number);
        this.navState = `tab${number}`;
    }
}
