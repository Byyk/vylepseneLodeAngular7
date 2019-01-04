import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-game-menu-item',
  templateUrl: './game-menu-item.component.html',
  styleUrls: ['./game-menu-item.component.scss']
})
export class GameMenuItemComponent implements OnInit {
    @Input()
    public rank: number;

    constructor() { }

    ngOnInit() {
    }
}
