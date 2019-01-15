import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Point, PoleModel, StavPole} from '../../../model/pole.model';
import {Field, GameService} from '../../../services/game.service';
import {AbilityData} from '../../../model/my-board.model';
import {filter, first} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {AngularFireAuth} from '@angular/fire/auth';
import {LodDoc, LodModel} from '../../../model/lod.model';

@Component({
    selector: 'app-oponents-board',
    templateUrl: './oponents-board.component.html',
    styleUrls: ['./oponents-board.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OponentsBoardComponent implements OnInit {
    public poles = new Array<PoleModel>();
    public stavPole = StavPole;
    public zasazenaPole: PoleModel[] = [];
    private lode: LodModel[];
    private pointLastHovered: Point = {x: -1, y: -1};
    private showHover = false;

    private actualRocket: AbilityData;

    @ViewChild('list')
    public list: ElementRef<HTMLDivElement>;

    constructor(
        public gs: GameService,
        private cdr: ChangeDetectorRef,
        private http: HttpClient,
        private afa: AngularFireAuth
    ) {
        this.gs.actualWeapon.subscribe(weapon => this.actualRocket = weapon);
        this.gs.actualField.pipe(
            filter(field => field === Field.enemyField),
            first()
        ).subscribe(() => this.cdr.markForCheck());
        this.gs._enemyShips.subscribe((lode: LodDoc[]) => {
            if(lode == null) return;
            this.gs.ships$.subscribe(ships => {
                this.lode = lode.map(lod => {
                    return new LodModel(ships.find(ship => ship.uid === lod.LodDataUid), lod.pozice, lod.smer);
                });
            });
        });
    }
    ngOnInit() {}
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
            if(!this.zasazenaPole.some(pole => Point.Equals(pole.pozice, point))) {
                nezasazazena.push(point);
            }
        });
        if (nezasazazena.length === 0) return;
        this.afa.idToken.pipe(first()).subscribe(token =>  {
            this.http.post(`${environment.urlBase}/matches/attack`, {
                token: token,
                pozice: {x, y},
                typ: this.actualRocket.typ,
                subTyp: this.actualRocket.supTyp
            }).subscribe();
        });
        this.zasazenaPole = this.zasazenaPole.concat(nezasazazena.map(pozice => {
            let zasah = false;
            this.lode.forEach(lod => {
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
        }));
        this.view();
    }
    hover(event: MouseEvent) {
        const x = Math.floor(event.offsetX / this.list.nativeElement.offsetHeight * 21);
        const y = Math.floor(event.offsetY / this.list.nativeElement.offsetHeight * 21);
        if(this.pointLastHovered.x === x && this.pointLastHovered.y === y) return;
        this.showHover = true;

        this.pointLastHovered.x = x;
        this.pointLastHovered.y = y;
        this.view();
    }
    mouseout() {
        this.showHover = false;
        this.view();
    }
    view() {
        const arr = new Array<PoleModel>();
        if(this.actualRocket != null && this.showHover)
            this.actualRocket.pattern.forEach(point => {
                const soucetBodu = Point.Sum(point, this.pointLastHovered);
                if(soucetBodu.x < 0 || soucetBodu.x > 20 || soucetBodu.y < 0 || soucetBodu.y > 20) return;
                arr.push({
                    pozice: soucetBodu,
                    state: StavPole.hover
                });
            });

        this.poles = arr.concat(this.zasazenaPole);
        this.cdr.markForCheck();
    }
}
