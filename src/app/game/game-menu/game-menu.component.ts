import {Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {faBolt, faCrosshairs, faRocket} from '@fortawesome/free-solid-svg-icons';
import {faSuperpowers} from '@fortawesome/free-brands-svg-icons';
import {faCompass, faLifeRing} from '@fortawesome/free-regular-svg-icons';
import {GameService} from '../../services/game.service';
import {LodData} from '../../model/lod.model';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MenuModel} from '../../model/my-board.model';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.scss']
})
export class GameMenuComponent implements OnInit {
    ships$: Observable<[LodData[]]>;
    menu: MenuModel;

    @ViewChildren('tabs')
    public tabs: QueryList<ElementRef<HTMLDivElement>>;

    constructor(
        public gs: GameService,
        public afs: AngularFirestore
    ) {
        this.ships$ = gs.ships$.pipe(map(lode => {
            const _lode: [LodData[]] = [[]];
            for(const lod of lode) {
                if(_lode[lod.rank - 1] === undefined) _lode[lod.rank - 1] = [lod];
                else _lode[lod.rank - 1].push(lod);
            }
            return _lode;
        }));
        this.menu = {
            tabs: [
                {icon: faRocket, toolTip: "Vystřilit z děla", doc: "Rakety/Common"},
                {icon: faBolt, toolTip: "Vystřelit z těžkého děla"},
                {icon: faSuperpowers, toolTip: "Použít speciální schopnost kapitána"},
                {icon: faCompass, toolTip: "Pohybovat loděmi"},
                {icon: faLifeRing, toolTip: "Zachránit posádku"}
            ]
        };
    }

    ngOnInit() {
    }
    secondaryMenuClicked(){
        this.tabs.forEach(tab => {
            tab.nativeElement.childNodes.forEach((child: HTMLElement) => {
                if(child.tagName === 'APP-GAME-SECONDARY-MENU') {
                    child.style.display = "none";
                    setTimeout(() => child.style.display = "", 200);
                }
            });
        });
    }
    isNotNull(val){
        return val != null;
    }
}
