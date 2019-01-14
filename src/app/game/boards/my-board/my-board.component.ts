import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {GameService, Mode} from '../../../services/game.service';
import {Point, PoleModel, StavPole} from '../../../model/pole.model';
import {LodModel} from '../../../model/lod.model';
import {BehaviorSubject} from 'rxjs';
import {filter} from 'rxjs/operators';

@Component({
    selector: 'app-my-board',
    templateUrl: './my-board.component.html',
    styleUrls: ['./my-board.component.scss'],
})
export class MyBoardComponent implements OnInit {
    public poles = new Array<PoleModel>();
    public lod: LodModel;
    public stavPole = StavPole;
    public boardEntered = new BehaviorSubject(false);
    private shipsLoaded = new BehaviorSubject(false);
    private CanPolozit = false;
    private polozeneLode : LodModel[] = [];
    private pointLastHovered: Point = {x: -1, y: -1};

    @ViewChild('list')
    public list: ElementRef<HTMLDivElement>;

    constructor(
        public gs: GameService
    ) {}

    getHeight(){
        return this.list.nativeElement.offsetHeight;
    }
    clicked(event: MouseEvent) {
        if(!this.CanPolozit || this.gs.Limits[this.lod.data.rank] === 0) return;
        this.polozeneLode.push(this.lod.clone());
        this.gs.lodPolozina(this.lod.data.rank, this.polozeneLode.map(lod => lod.doc));
        this.View();
    }
    poleRightClick(){
        this.lod.otocSe();
        this.View();
        return false;
    }
    hover(event: MouseEvent){
        const x = Math.floor(event.offsetX / this.list.nativeElement.offsetHeight * 21);
        const y = Math.floor(event.offsetY / this.list.nativeElement.offsetHeight * 21);

        if (this.pointLastHovered.x === x && this.pointLastHovered.y === y ) return;
        this.pointLastHovered.x = x;
        this.pointLastHovered.y = y;

        if(this.lod != null)
            this.lod.pozice = {x: x, y: y};

        this.View();

        return false;
    }
    View(){
        this.poles = [];
        if(this.gs.ActualMode === Mode.PlaceShips)
            this.pokladaniView();

        this.polozeneLode.forEach(lod => {
            const castiLode = lod.castiLode;
            castiLode.forEach(cast => {
                this.poles.push({pozice: cast.pozice, state: StavPole.lod, dalsicasti: castiLode});
            });
            this.poles.push({state: StavPole.none, pozice: lod.pozice, lod: lod.viewData});
        });

        const pole = this.poles.find(_pole => _pole.pozice.x === this.pointLastHovered.x &&
            _pole.pozice.y === this.pointLastHovered.y && _pole.state === StavPole.lod);

        if(pole != null && pole.dalsicasti != null)
            for(const cast of pole.dalsicasti) {
                this.poles.push({pozice: cast.pozice, state: StavPole.hover});
            }
        else this.poles.push({state: StavPole.hover, pozice: {x: this.pointLastHovered.x, y: this.pointLastHovered.y}});
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
            spravne.forEach(spr => this.poles.push({state: StavPole.chybaPokladani, pozice: spr}));
        }
        else {
            this.CanPolozit = true;
            spravne.forEach(spr => this.poles.push({state: StavPole.lod, pozice: spr}));
        }
        this.poles.push({pozice: this.lod.pozice, state: StavPole.none, lod: this.lod.viewData});
    }
    zjistiPrekriVy() : boolean{
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
    }
    ZkotrolujPole(pole: PoleModel, lod: LodModel) : boolean {
        if(lod == null) return false;
        return lod.pozice.x === pole.pozice.x && lod.pozice.y === pole.pozice.y;
    }
    ngOnInit() {
        this.gs.shipSelected.subscribe(data => {
            this.lod.data = data;
        });
        this.gs.ships$.subscribe(lode => {
            this.lod = new LodModel(lode[0], { x: 1, y: 1 });
            this.shipsLoaded.next(true);
            this.gs.placedShips.pipe(filter(_lode => _lode != null)).subscribe(_lode => {
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
