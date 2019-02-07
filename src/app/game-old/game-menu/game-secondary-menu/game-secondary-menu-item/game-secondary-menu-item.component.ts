import {Component, Input, OnInit} from '@angular/core';
import {AbilityData} from '../../../../model/my-board.model';
import {IconDefinition} from '@fortawesome/fontawesome-common-types';
import {FontAwesomeDirectory} from '../../../../model/FontAwesome.directory';

@Component({
  selector: 'app-game-secondary-menu-item',
  templateUrl: './game-secondary-menu-item.component.html',
  styleUrls: ['./game-secondary-menu-item.component.scss']
})
export class GameSecondaryMenuItemComponent implements OnInit {
    @Input()
    public tab: AbilityData;
    public _icon: IconDefinition;

    constructor() {
    }

    ngOnInit() {
        this._icon = FontAwesomeDirectory.data[this.tab.icon];
    }
}
