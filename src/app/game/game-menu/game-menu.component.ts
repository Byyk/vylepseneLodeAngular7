import {Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {faBolt, faRocket} from '@fortawesome/free-solid-svg-icons';
import {faSuperpowers} from '@fortawesome/free-brands-svg-icons';
import {faCompass, faLifeRing} from '@fortawesome/free-regular-svg-icons';
import {LodData} from '../../model/lod.model';
import {MenuModel} from '../../model/my-board.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {emitors, GameState, Gs2Service} from '../../services/gs2.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.scss']
})
export class GameMenuComponent implements OnInit {
    ships: [LodData[]];
    menu: MenuModel;
    rozmisteno: Observable<boolean>;

    @ViewChildren('tabs')
    public tabs: QueryList<ElementRef<HTMLDivElement>>;

    constructor(
        // public gs: GameService,
        public gs2: Gs2Service,
        public afs: AngularFirestore
    ) {
        this.ships = this.gs2.storage.getData(zpracujLode);
        this.rozmisteno = this.gs2.storage.getEmitor(emitors.rozmisteno);
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
/*
*
*
*
*
*
*
*                        Warning
*
*
*
*
*
*
* ╔══════════╗  ╔══════════╗  ╔═══════╗   ╔═════╗   ╔═══════╗   ╔══════════╗   ╔════════╗  ╔══════════╗  ╔═════╗  ╔═╗         ╔═╗  ╔══════╗
* ║ ╔══════╗ ║  ║ ╔══════╗ ║  ║ ╔═══╗ ╚╗  ╚═╗ ╔═╝  ╔╝ ╔═══╗ ╚╗  ║ ╔══════╗ ║   ║ ╔══════╝  ╚═══╗  ╔═══╝  ╚═╗ ╔═╝  ╚╗╚╗       ╔╝╔╝  ║ ╔════╝
* ║ ║      ║ ║  ║ ║      ║ ║  ║ ║   ╚╗ ║    ║ ║    ║  ║   ║  ║  ║ ║      ║ ║   ║ ║             ║  ║        ║ ║     ╚╗╚╗     ╔╝╔╝   ║ ║
* ║ ╚══════╝ ║  ║ ╚══════╝ ║  ║ ║    ║ ║    ║ ║    ║  ║   ║  ║  ║ ╚══════╝ ║   ║ ║             ║  ║        ║ ║      ╚╗╚╗   ╔╝╔╝    ║ ╚═══╗
* ║ ╔═══╦═╦══╝  ║ ╔══════╗ ║  ║ ║    ║ ║    ║ ║    ║  ║   ║  ║  ║ ╔══════╗ ║   ║ ║             ║  ║        ║ ║       ╚╗╚╗ ╔╝╔╝     ║ ╔═══╝
* ║ ║   ║ ║     ║ ║      ║ ║  ║ ║   ╔╝ ║    ║ ║    ║  ║   ║  ║  ║ ║      ║ ║   ║ ║             ║  ║        ║ ║        ╚╗╚═╝╔╝      ║ ║
* ║ ║   ║ ║     ║ ║      ║ ║  ║ ╚═══╝ ╔╝  ╔═╝ ╚═╗  ╚╗ ╚═══╝ ╔╝  ║ ║      ║ ║   ║ ╚══════╗      ║  ║      ╔═╝ ╚═╗       ╚╗ ╔╝       ║ ╚════╗
* ╚═╝   ╚═╝     ╚═╝      ╚═╝  ╚═══════╝   ╚═════╝   ╚═══════╝   ╚═╝      ╚═╝   ╚════════╝      ╚══╝      ╚═════╝        ╚═╝        ╚══════╝
*
*                                         ╔════════╗   ╔═══════╗   ╔═══════╗   ╔══════╗  ╔═╗
*                                         ║ ╔══════╝  ╔╝ ╔═══╗ ╚╗  ║ ╔═══╗ ╚╗  ║ ╔════╝  ║ ║
*                                         ║ ║         ║  ║   ║  ║  ║ ║   ╚╗ ║  ║ ║       ║ ║
*                                         ║ ║         ║  ║   ║  ║  ║ ║    ║ ║  ║ ╚═══╗   ║ ║
*                                         ║ ║         ║  ║   ║  ║  ║ ║    ║ ║  ║ ╔═══╝   ║ ║
*                                         ║ ║         ║  ║   ║  ║  ║ ║   ╔╝ ║  ║ ║       ╚═╝
*                                         ║ ╚══════╗  ╚╗ ╚═══╝ ╔╝  ║ ╚═══╝ ╔╝  ║ ╚════╗  ╔═╗
*                                         ╚════════╝   ╚═══════╝   ╚═══════╝   ╚══════╝  ╚═╝
*
*
* */

export const zpracujLode = (lode: GameState) => {
    const _lode: [LodData[]] = [[]];
    for(const lod of lode.lodedata) {
        if(_lode[lod.rank - 1] === undefined) _lode[lod.rank - 1] = [lod];
        else _lode[lod.rank - 1].push(lod);
    }
    return _lode;
};
