import {Component, OnInit, ViewChild} from '@angular/core';
import {GameService} from '../../../services/game.service';
import {Point, PoleModel, StavPole} from '../../../model/pole.model';
import {LodModel} from '../../../model/lod.model';
import {forEach} from '@angular/router/src/utils/collection';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-my-board',
  templateUrl: './my-board.component.html',
  styleUrls: ['./my-board.component.scss']
})
export class MyBoardComponent implements OnInit {
    public poles = new Array<PoleModel>();
    public lod: LodModel;
    private CanPolozit = false;
    private polozeneLode : LodModel[] = [];

    @ViewChild('list')
    public list;

    constructor(
        public gs: GameService,
        public afs: AngularFirestore
    ) {
        for(let i = 0; i < 21; i++) {
            for(let j = 0; j < 21; j++){
                this.poles.push({pozice: {x: j, y: i}, state: StavPole.more});
            }
        }
        this.lod = new LodModel({
            uid: 'uid',
            name: 'jmeno',
            trida: 'trida',
            casti: {
                rovne: [
                    {x: 0, y: 0},
                    {x: 0, y: -1}, {x: 1, y: -1},
                    {x: 0, y: -2}, {x: 1, y: -2},
                    {x: 0, y: -3}, {x: 1, y: -3},
                    {x: 0, y: -4}, {x: 1, y: -4},
                    {x: 0, y: -5}
                ],
                sikmo: [
                    {x: 0, y: -0}, {x: 1, y: 0},
                    {x: 1, y: -1}, {x: 2, y: -1},
                    {x: 2, y: -2}, {x: 3, y: -2},
                    {x: 2, y: -3},{x: 3, y: -3}, {x: 4, y: -3},
                    {x: 4, y: -4},
                ]
            },
            posun: {
                rovne: {
                    hori: -10,
                    vert: 5
                },
                sikmo: {
                    hori: 0,
                    vert: 10
                }
            },
            imgUrl: "https://firebasestorage.googleapis.com/v0/b/lode-1835e.appspot.com/o/Lode%2Fkriznik-zkraceny.svg?alt=media&token=49a613e3-05c9-415a-9fb0-56e657332939",
            osmismerna: true,
        }, { x: 1, y: 1 });
    }

    getHeight(){
        return this.list._element.nativeElement.offsetHeight + 'px';
    }
    poleclicked(pole: PoleModel) {
        if(!this.CanPolozit) return;
        this.polozeneLode.push(this.lod.clone());
    }
    poleRightClick(pole: PoleModel){
        this.lod.otocSe();
        this.pokladaniView();
        return false;
    }
    hover(point: Point){
        this.lod.pozice = point;
        this.pokladaniView();
    }
    pokladaniView(){
        this.poles.forEach(pole => pole.state = 1);
        this.View();
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

    View(){
        this.poles.forEach(pole => pole.lod = undefined);
        this.polozeneLode.forEach(lod => {
            this.poles[Point.toNumber(lod.pozice)].lod = lod.viewData;
            lod.castiLode.forEach(cast => {
                this.poles[Point.toNumber(cast.pozice)].state = StavPole.lod;
            });
        });
    }
    ngOnInit() {
    }
    floor = Math.floor;

}

/*
*
        {
            uid: 'uid',
            name: 'jmeno',
            trida: 'trida',
            casti: {
                rovne: [
                    {x: 0, y: 0}, {x: 1, y: 0}, {x: -1, y: -1},
                    {x: 0, y: -1}, {x: 1, y: -1}, {x: -1, y: -2},
                    {x: 0, y: -2}, {x: 1, y: -2}, {x: -1, y: -3},
                    {x: 0, y: -3}, {x: 1, y: -3}, {x: -1, y: -4},
                    {x: 0, y: -4}, {x: 1, y: -4}, {x: -1, y: -5},
                    {x: 0, y: -5}, {x: 1, y: -5}, {x: -1, y: -5},
                    {x: 0, y: -5}, {x: 1, y: -5}, {x: -1, y: -6},
                    {x: 0, y: -6}, {x: 1, y: -6}, {x: 0, y: -7},
                    {x: 1, y: -7},
                ],
                sikmo: [
                    {x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0},
                    {x: 0, y: -1}, {x: 1, y: -1}, {x: 2, y: -1},
                    {x: 3, y: -1}, {x: 0, y: -2}, {x: 1, y: -2},
                    {x: 2, y: -2}, {x: 3, y: -2}, {x: 4, y: -2},
                    {x: 1, y: -3}, {x: 2, y: -3}, {x: 3, y: -3},
                    {x: 4, y: -3}, {x: 2, y: -4}, {x: 3, y: -4},
                    {x: 4, y: -4}, {x: 5, y: -4}, {x: 3, y: -5},
                    {x: 4, y: -5}, {x: 5, y: -5}, {x: 6, y: -5},
                    { x: 5, y: -6}
                ]
            },
            imgUrl: "https://firebasestorage.googleapis.com/v0/b/lode-1835e.appspot.com/o/Lode%2FletadlovaLod%20.svg?alt=media&token=1c323a75-39fb-4bcf-83f1-3b5e181bd9d4",
        }, { x: 1, y: 1 }
* */
