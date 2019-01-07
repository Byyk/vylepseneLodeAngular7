import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {GameService, Mode} from '../../../services/game.service';
import {Point, PoleModel, StavPole} from '../../../model/pole.model';
import {LodModel} from '../../../model/lod.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'app-my-board',
    templateUrl: './my-board.component.html',
    styleUrls: ['./my-board.component.scss'],
})
export class MyBoardComponent implements OnInit {
    public poles = new Array<PoleModel>();
    public lod: LodModel;
    public boardEntered = new BehaviorSubject(false);
    private shipsLoaded = new BehaviorSubject(false);
    private CanPolozit = false;
    private polozeneLode : LodModel[] = [];

    @ViewChild('list')
    public list;

    constructor(
        public gs: GameService
    ) {}

    getHeight(){
        return this.list._element.nativeElement.offsetHeight + 'px';
    }
    poleclicked(pole: PoleModel) {
        if(!this.CanPolozit || this.gs.Limits[this.lod.data.rank] === 0) return;
        this.polozeneLode.push(this.lod.clone());
        this.gs.lodPolozina(this.lod.data.rank, this.polozeneLode.map(lod => lod.doc));
        this.View();
    }
    poleRightClick(pole: PoleModel){
        this.lod.otocSe();
        this.View();
        return false;
    }
    hover(point: Point){
        if(this.lod != null)
            this.lod.pozice = point;
        this.View();
    }
    View(){
        this.poles.forEach(pole => pole.state = 1);
        if(this.gs.ActualMode === Mode.PlaceShips)
            this.pokladaniView();
        this.poles.forEach(pole => pole.lod = undefined);
        this.polozeneLode.forEach(lod => {
            this.poles[Point.toNumber(lod.pozice)].lod = lod.viewData;
            lod.castiLode.forEach(cast => {
                this.poles[Point.toNumber(cast.pozice)].state = StavPole.lod;
            });
        });
    }
    pokladaniView(){
        const casti = this.lod.castiLode;
        const spravne = [];
        casti.forEach(cast => {
            if(cast.pozice.x >= 0 && cast.pozice.x <= 20 && cast.pozice.y >= 0 && cast.pozice.y <= 20){
                spravne.push(cast.pozice);
            }
        });
        if(spravne.length !== casti.length || this.zjistiPrekriVy()) {
            this.CanPolozit = false;
            spravne.forEach(spr => this.poles[Point.toNumber(spr)].state = StavPole.chybaPokladani);
        }
        else {
            this.CanPolozit = true;
            spravne.forEach(spr => this.poles[Point.toNumber(spr)].state = StavPole.lod);
        }
    }
    private zjistiPrekriVy() : boolean{
        let prekriv;
        for(let i = 0; i < this.polozeneLode.length; i++){
            const lod = this.polozeneLode[i];
            prekriv = this.lod.castiLode.some(cast => {
                return lod.castiLode.some(_cast => {
                    return Point.Equals(_cast.pozice, cast.pozice);
                });
            });
            if(prekriv) break;
        }
        return prekriv;
    }
    boardLeaveEnter(entered: boolean) {
        this.boardEntered.next(entered);
        this.poles.forEach(pole => pole.state = 1);
        this.View();
    }
    ZkotrolujPole(pole: PoleModel, lod: LodModel) : boolean     {
        if(lod == null) return false;
        return lod.pozice.x === pole.pozice.x && lod.pozice.y === pole.pozice.y;
    }
    ngOnInit() {
        for(let i = 0; i < 21; i++) {
            for(let j = 0; j < 21; j++){
                this.poles.push({pozice: {x: j, y: i}, state: StavPole.more});
            }
        }
        this.gs.shipSelected.subscribe(data => {
            this.lod.data = data;
        });
        this.gs.ships$.subscribe(lode => {
            this.lod = new LodModel(lode[0], { x: 1, y: 1 });
            this.shipsLoaded.next(true);
            this.gs.placedShips.subscribe(_lode => {
                console.log(_lode);
                this.polozeneLode = _lode.map(lod => new LodModel(lode.find(value => value.uid === lod.LodDataUid), lod.pozice, lod.smer));
                for(const lod of this.polozeneLode) {
                    this.gs.lodPolozina(lod.data.rank);
                }
            });
        });

        this.View();
    }

    floor = Math.floor;

}
