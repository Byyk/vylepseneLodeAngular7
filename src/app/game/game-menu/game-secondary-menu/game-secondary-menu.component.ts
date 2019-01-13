import {AfterViewInit, Component, Input, OnInit,} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AbilityData, DOCData, OnlyDocData} from '../../../model/my-board.model';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {GameService} from '../../../services/game.service';

@Component({
  selector: 'app-game-secondary-menu',
  templateUrl: './game-secondary-menu.component.html',
  styleUrls: ['./game-secondary-menu.component.scss']
})
export class GameSecondaryMenuComponent implements OnInit, AfterViewInit {
    @Input()
    public menudoc: string;

    @Input()
    public index: number;

    public data: DOCData;
    public docdata: Observable<OnlyDocData>;

    constructor(
        private afs: AngularFirestore,
        private gs: GameService
    ) {}

    ngOnInit() {}

    ngAfterViewInit(): void {
        this.docdata = this.afs.doc(this.menudoc).get().pipe(
            map(doc => {
                this.data = doc.data() as DOCData;
                const docdata : OnlyDocData = {};
                for(const key in this.data) {
                    if(this.data[key] != null){
                        if(typeof this.data[key] === "number") continue;
                        docdata[key] = this.data[key] as AbilityData;
                    }
                }
                return docdata;
            })
        );
    }

    clicked(data: AbilityData, key: string){
        this.gs.changeMode(this.index + 1);
        data.supTyp = key;
        data.typ = key.split('-')[0];
        this.gs.setWeapon(data);
    }
}
