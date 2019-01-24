import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Point, PoleModel, StavPole} from '../../../model/pole.model';
import {Field} from '../../../services/game.service';
import {AbilityData} from '../../../model/my-board.model';
import {filter, first, map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {AngularFireAuth} from '@angular/fire/auth';
import {LodModel} from '../../../model/lod.model';
import {Gs2Service} from '../../../services/gs2.service';
import {Poles} from '../my-board/my-board.component';

@Component({
    selector: 'app-oponents-board',
    templateUrl: './oponents-board.component.html',
    styleUrls: ['./oponents-board.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OponentsBoardComponent implements OnInit {
    public poles: Poles<OpponentsBoardData>;
    public stavPole = StavPole;
    public Hover: PoleModel[] = [];
    private pointLastHovered: Point = {x: -1, y: -1};
    private actualRocket: AbilityData;

    @ViewChild('list')
    public list: ElementRef<HTMLDivElement>;

    constructor(
        public gs2: Gs2Service,
        private cdr: ChangeDetectorRef,
        private http: HttpClient,
        private afa: AngularFireAuth
    ) {
        this.poles = new Poles(data => data.vystrely);
        this.poles.data.vystrely = [];
        this.gs2.selectedWeapon.subscribe(weapon => this.actualRocket = weapon);
        this.gs2.boardsState.pipe(
            map(state => state.field),
            filter(field => field === Field.enemyField),
            first()
        ).subscribe(() => this.cdr.markForCheck());

        this.poles.data.lode = this.gs2.storage.getData(data =>
            data.lode[this.gs2.storage.getData(_data => _data.userData.lastMatch.creator ? 'opponent' : 'creator')].lode)
            .map(lod => {
               return new LodModel(this.gs2.storage.getData(data => data.lodedata)
                   .find(_lod => _lod.uid === lod.LodDataUid), lod.pozice, lod.smer);
            });
        this.zpracujVysrely(this.gs2.storage.getData(data => data.tahy
            .filter(tah => tah.seenFor === (data.userData.lastMatch.creator ? 'opponent' : 'creator'))
            .map(tah => this.gs2.storage.getData(_data => _data.utoky)
                .find(utok => utok.subTyp === tah.tahData.subTyp)
                .pattern.map(pat => Point.Sum(pat, tah.tahData.poziceZasahu)))
        ));
    }
    ngOnInit() {
    }
    private zpracujVysrely = (_data) => {
        let data = [];
        for(const dat of _data) {
            data = data.concat(dat);
        }
        if(data == null || this.poles.data.lode == null) return;
        this.poles.data.vystrely = this.poles.data.vystrely.concat(data.map(pozice => {
            if(pozice == null) return null;
            let zasah = false;
            this.poles.data.lode.forEach(lod => {
                lod.castiLode.forEach((cast) => {
                    if(Point.Equals(cast.pozice, pozice)){
                        zasah = true;
                    }
                });
            });
            if(zasah)
                return {pozice: pozice, state: StavPole.poskozenaLod};
            else
                return {pozice: pozice, state: StavPole.zasazeneMore};
        })).filter(pole => pole != null);
        this.poles.reatatch();
    }

    getHeight(){
        return this.list.nativeElement.offsetHeight;
    }
    clicked(event: MouseEvent) {
        const x = Math.floor(event.offsetX / this.list.nativeElement.offsetHeight * 21);
        const y = Math.floor(event.offsetY / this.list.nativeElement.offsetHeight * 21);

        if (this.actualRocket == null) return;
        const nezasazazena: Point[] = [];
        this.actualRocket.pattern.forEach(point => {
            point = Point.Sum(point, {x, y});
            if(point.x >= 0 && point.x <= 20 && point.y >= 0 && point.y <= 20)
            if(!this.poles.data.vystrely.some(pole => Point.Equals(pole.pozice, point))) {
                nezasazazena.push(point);
            }
        });
        if (nezasazazena.length === 0) return;
        this.afa.idToken.pipe(first()).subscribe(token =>  {
            this.http.post(`${environment.urlBase}/matches/Attack`, {
                token: token,
                pozice: {x, y},
                typ: this.actualRocket.typ,
                subTyp: this.actualRocket.supTyp
            }).subscribe();
        });
        this.zpracujVysrely([nezasazazena]);
    }
    hover(event: MouseEvent) {
        const x = Math.floor(event.offsetX / this.list.nativeElement.offsetHeight * 21);
        const y = Math.floor(event.offsetY / this.list.nativeElement.offsetHeight * 21);
        if(this.pointLastHovered.x === x && this.pointLastHovered.y === y) return;
        this.pointLastHovered.x = x; this.pointLastHovered.y = y;

        if(this.gs2.selectedWeapon.value != null)
            this.Hover = this.gs2.selectedWeapon.value.pattern
                .map(pat => ({pozice: Point.Sum(pat, this.pointLastHovered ), state: StavPole.hover}));
    }
    mouseout() {
        this.pointLastHovered = {x: -1, y: -1};
    }
}

interface OpponentsBoardData {
    vystrely: PoleModel[];
    lode: LodModel[];
}
