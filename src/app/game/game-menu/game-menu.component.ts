import { Component, OnInit } from '@angular/core';
import {faBolt, faRocket} from '@fortawesome/free-solid-svg-icons';
import {faSuperpowers} from '@fortawesome/free-brands-svg-icons';
import {faCompass, faLifeRing} from '@fortawesome/free-regular-svg-icons';
import {GameService, Limits} from '../../services/game.service';
import {LodData, LodDoc} from '../../model/lod.model';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export interface PlaceData {
    [key: string] : LodDoc;
}

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

    ships$: Observable<[LodData[]]>;

    constructor(
        public gs: GameService
    ) {
        this.ships$ = gs.ships$.pipe(map(lode => {
            const _lode: [LodData[]] = [[]];
            for(const lod of lode) {
                if(_lode[lod.rank - 1] === undefined) _lode[lod.rank - 1] = [lod];
                else _lode[lod.rank - 1].push(lod);
            }
            return _lode;
        }));
    }

    ngOnInit() {
    }
}
