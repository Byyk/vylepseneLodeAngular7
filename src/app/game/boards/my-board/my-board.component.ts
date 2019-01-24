import {ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Point, PoleModel, StavPole} from '../../../model/pole.model';
import {LodModel} from '../../../model/lod.model';
import {BehaviorSubject} from 'rxjs';
import {GameState, Gs2Service, Mode, transformers} from '../../../services/gs2.service';

@Component({
    selector: 'app-my-board',
    templateUrl: './my-board.component.html',
    styleUrls: ['./my-board.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyBoardComponent implements OnInit {
    public poles: Poles<MyBoardData>;
    public stavPole = StavPole;
    public Hover: PoleModel[] = [];
    public boardEntered = new BehaviorSubject(false);
    private shipsLoaded = new BehaviorSubject(false);
    private CanPolozit = false;
    private pointLastHovered: Point = {x: -1, y: -1};

    @ViewChild('list')
    public list: ElementRef<HTMLDivElement>;

    constructor(
        private gs2: Gs2Service,
    ) {
        this.poles = new Poles<MyBoardData>(data => {
            let poles : PoleModel[] = [];
            for(const lod of data.polozeneLode) {
                const casti = lod.castiLode;
                poles.push({pozice: lod.pozice, lod: lod.viewData, dalsicasti: casti});
                for(const cast of casti) {
                    poles.push({pozice: cast.pozice, state: StavPole.lod, dalsicasti: casti});
                }
            }
            if(data.dopady != null)
                poles = poles.concat(data.dopady);
            if(this.gs2.boardsState.value.mode === Mode.PlaceShips){
                const casti = data.lod.castiLode;
                const spravne = [];
                for(const cast of casti) {
                    if(cast.pozice.x >= 0 && cast.pozice.x <= 20 && cast.pozice.y >= 0 && cast.pozice.y <= 20)
                        spravne.push(cast.pozice);
                }
                if(spravne.length !== casti.length || this.zjistiPrekriVy()) {
                    this.CanPolozit = false;
                    spravne.forEach(spr => poles.push({state: StavPole.chybaPokladani, pozice: spr}));
                }
                else {
                    this.CanPolozit = true;
                    spravne.forEach(spr => poles.push({state: StavPole.lod, pozice: spr}));
                }
                poles.push({pozice: data.lod.pozice, state: StavPole.none, lod: data.lod.viewData});
            }
            return poles;
        });
    }

    getHeight(){
        return this.list.nativeElement.offsetHeight;
    }
    clicked() {
        const lod = this.poles.data.lod.clone();
        if(!this.CanPolozit || this.gs2.storage.getData((data) => data.limits)[lod.data.rank] === 0) return;
        this.poles.data.polozeneLode.push(lod);
        this.gs2.lodPolozina(lod.data.rank, this.poles.data.polozeneLode.map(_lod => _lod.doc));
        this.poles.reatatch();
    }
    poleRightClick(){
        this.poles.data.lod.otocSe();
        this.poles.reatatch();
        return false;
    }
    hover(event: MouseEvent){
        const x = Math.floor(event.offsetX / this.list.nativeElement.offsetHeight * 21);
        const y = Math.floor(event.offsetY / this.list.nativeElement.offsetHeight * 21);

        if (this.pointLastHovered.x === x && this.pointLastHovered.y === y ) return;
        this.pointLastHovered.x = x;
        this.pointLastHovered.y = y;

        if(this.poles.data.lod != null)
            this.poles.data.lod.pozice = {x: x, y: y};

        this.Hover = [];
        const pole = this.poles.reatatched.value.find(_pole => Point.Equals(_pole.pozice, this.pointLastHovered) &&
            _pole.state === StavPole.lod);
        if(pole != null)
            for(const casti of pole.dalsicasti) {
                this.Hover.push({pozice: casti.pozice, state: StavPole.hover});
            }
        else this.Hover.push({pozice: this.pointLastHovered, state: StavPole.hover});

        if(this.gs2.boardsState.value.mode === Mode.PlaceShips)
            this.poles.reatatch();
        return false;
    }
    zjistiPrekriVy() : boolean{
        let prekriv;
        for(let i = 0; i < this.poles.data.polozeneLode.length; i++){
            const lod = this.poles.data.polozeneLode[i];
            prekriv = this.poles.data.lod.castiLode.some(cast => {
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
        this.gs2.selectedShip.subscribe(data => {
            if(data == null) return;
            this.poles.data.lod.data = data;
        });
        this.zpracujLode(this.gs2.storage.getData(zpracujLode));
        this.gs2.storage.getTransformer<Point[]>(transformers.dopady).subscribe(dopady => {
            this.poles.data.dopady = dopady.map(point => {
                if(this.JeLodNapozici(point))
                    return {pozice: point, state: StavPole.poskozenaLod} as PoleModel;
                else return {pozice: point, state: StavPole.zasazeneMore} as PoleModel;
            });
            this.poles.reatatch();
        });
        this.poles.reatatch();
    }
    floor = Math.floor;
    private zpracujLode = lode => {
        this.poles.data.lod = new LodModel(lode[0], { x: 1, y: 1 });
        this.shipsLoaded.next(true);
        this.poles.data.polozeneLode = this.gs2.storage.getData(data => data.lode['creator'].lode)
            .map(lod => new LodModel(lode.find(value => value.uid === lod.LodDataUid), lod.pozice, lod.smer));
        for(const lod of this.poles.data.polozeneLode) {
            this.gs2.lodPolozina(lod.data.rank);
        }
    }
    private JeLodNapozici(point: Point) {
        for(const lod of this.poles.data.polozeneLode) {
            for(const cast of lod.castiLode) {
                if(!Point.Equals(cast.pozice, point)) continue;
                return Point.Equals(cast.pozice, point);
            }
        }
        return false;
    }
}

const zpracujLode = (data: GameState)  => {
    return data.lodedata;
};

export class Poles<T> {
    private readonly _reatatch: (data: T) => PoleModel[];
    reatatched = new BehaviorSubject<PoleModel[]>([]);
    data: T;
    constructor(reatatch: (data: T) => PoleModel[]) {
        this._reatatch = reatatch;
        this.data = {} as T;
    }
    reatatch = () => this.reatatched.next(this._reatatch(this.data));
}

export interface MyBoardData {
    dopady: PoleModel[];
    lod: LodModel;
    polozeneLode: LodModel[];
}

