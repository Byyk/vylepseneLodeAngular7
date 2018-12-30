import { Component, OnInit } from '@angular/core';
import {faBolt, faRocket} from '@fortawesome/free-solid-svg-icons';
import {faSuperpowers} from '@fortawesome/free-brands-svg-icons';
import {faCompass, faLifeRing} from '@fortawesome/free-regular-svg-icons';
import {GameService} from '../../services/game.service';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.scss']
})
export class GameMenuComponent implements OnInit {
    faRocket = faRocket;
    faBolt = faBolt;
    faSuperPowers = faSuperpowers;
    faCompass = faCompass;
    faLifeRing = faLifeRing;

    constructor(
        public gs: GameService
    ) { }

    ngOnInit() {
    }
}
