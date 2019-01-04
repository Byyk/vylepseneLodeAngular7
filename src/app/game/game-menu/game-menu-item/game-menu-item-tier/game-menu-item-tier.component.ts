import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-game-menu-item-tier',
  templateUrl: './game-menu-item-tier.component.html',
  styleUrls: ['./game-menu-item-tier.component.scss']
})
export class GameMenuItemTierComponent implements OnInit {
    @Input()
    public rank: number;

    constructor() { }

    ngOnInit() {
    }
}
