import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {

    @Output()
    public clicked = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    activate(){
        this.clicked.emit();
    }
}
