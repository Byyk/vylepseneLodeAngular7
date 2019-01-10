import {AfterViewChecked, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {GameService} from '../services/game.service';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements OnInit, AfterViewChecked {

    constructor(
        public gs: GameService
    ) {
        gs.actualField.subscribe(() => {});
    }

    ngOnInit() {
    }

}
