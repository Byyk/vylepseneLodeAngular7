import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {MatchMakingService} from './match-making.service';
import {Match} from '../model/match.model';
import {LoginService} from './login.service';
import {LodData, LodDoc} from '../model/lod.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {map, skip} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AbilityData, DOCData} from '../model/my-board.model';
import {Point} from '../model/pole.model';
import {TahModel, Utok} from '../model/tah.model';
import {Raketa} from '../model/raketa.model';

export interface Limits {
    [key: number]: number;
}

@Injectable({
    providedIn: 'root'
})
export class GameService {
    public _actualField = new BehaviorSubject<Field>(Field.playerField);
    public ActualField = Field.playerField;
    public actualField: Observable<Field>;

    public _actualMode = new BehaviorSubject<Mode>(Mode.Nada);
    public ActualMode = Mode.Nada;
    public actualMode: Observable<Mode>;

    public _rozmisteno = new BehaviorSubject<boolean>(true);
    public Rozmisteno = false;
    public rozmisteno: Observable<boolean>;

    ships$: Observable<LodData[]>;
    ships: LodData[];

    public limits$: Observable<Limits>;
    public _limits = new BehaviorSubject<Limits>({});
    public limits: Observable<Limits>;
    Limits: Limits;

    public _shipSelected = new BehaviorSubject<LodData>(null);
    public shipSelected: Observable<LodData>;

    public _placedShips = new BehaviorSubject<LodDoc[]>([]);
    public placedShips: Observable<LodDoc[]>;

    public _actualWeapon = new BehaviorSubject<AbilityData>(null);
    public actualWeapon: Observable<AbilityData>;

    public _enemyShips = new BehaviorSubject<LodDoc[]>(null);
    public enemyShips: Observable<LodDoc[]>;

    public _vystrely = new BehaviorSubject<Point[]>([]);
    public vystrely: Observable<Point[]>;
    public Vystrely: Point[] = [];

    public _zbrane = new BehaviorSubject<Raketa[]>(null);
    public zbrane: Observable<Raketa[]>;

    constructor(
        public mms: MatchMakingService,
        private ls: LoginService,
        private afs: AngularFirestore,
        private http: HttpClient,
    ) {
        this.enemyShips = this._enemyShips.pipe(skip(1));
        this.vystrely = this._vystrely.asObservable();
        this.zbrane = this._zbrane.asObservable();
        this.vystrely.subscribe(strela => {
            this.Vystrely = this.Vystrely.concat(strela);
        });
        this.actualWeapon = this._actualWeapon.asObservable();

        this.actualField = this._actualField.asObservable();
        this.actualField.subscribe((data) => this.ActualField = data);

        this.actualMode = this._actualMode.asObservable();
        this.actualMode.subscribe((data) => this.ActualMode = data);

        this.rozmisteno = this._rozmisteno.asObservable();
        this.afs.collection('Rakety').get().pipe(
            map(snap => snap.docs.map(doc => doc.data() as DOCData)),
            map(data => {
                const ret = [];
                for (const doc of data) {
                    for (const key in doc) {
                        if (typeof doc[key] === "number") continue;
                        const utok = doc[key] as AbilityData;
                        ret.push({
                            typ: key.split('-')[0],
                            cooldown: doc.cooldown,
                            type: doc.type,
                            subTyp: key,
                            pattern: utok.pattern
                        } as Raketa);
                    }
                }
                return ret;
            })
        ).subscribe(data => this._zbrane.next(data));
        this.rozmisteno.subscribe((data) => {
            this.Rozmisteno = data;
            if (!data) this._actualMode.next(Mode.PlaceShips);
            else {
                this.ls.userloaded.subscribe(loaded => {
                    if (loaded && this.ls.userData.lastMatch.lastMatchUid !== '') {
                        this.afs.doc(`Matches/${this.ls.userData.lastMatch.lastMatchUid}/Lode/${this.ls.userData.lastMatch.creator ? 'creator' : 'opponent'}`)
                            .get().pipe(map(lode => {
                            if (lode.data() == null) return null;
                            return lode.data().lode as LodDoc[];
                        })).subscribe(lode => this._placedShips.next(lode));

                        this.afs.doc(`Matches/${this.ls.userData.lastMatch.lastMatchUid}/Lode/${this.ls.userData.lastMatch.creator ? 'opponent' : 'creator'}`)
                            .get().pipe(map(lode => {
                            if (lode.data() == null) return null;
                            return lode.data().lode as LodDoc[];
                        })).subscribe(lode => this._enemyShips.next(lode));

                        this.afs.collection(`Matches/${this.ls.userData.lastMatch.lastMatchUid}/Tahy`).get().pipe(
                            map(snap => snap.docs.map(doc => doc.data() as TahModel)),
                            map(Data => ({
                                creator: Data.filter(_data => _data.seenFor === 'creator'),
                                opponent: Data.filter(_data => _data.seenFor === 'opponent')
                            }))
                        ).subscribe(res => {
                            this.zbrane.subscribe(zbrane => {
                                if (data == null) return;
                                const vysledek = [];
                                res[this.ls.userData.lastMatch.creator ? 'creator' : 'opponent']
                                    .filter(utok => utok.type === "Utok")
                                    .map((raketa: TahModel) => raketa.tahData)
                                    .map((raketa: Utok) => {
                                        const zbran = zbrane.find(_zbran => _zbran.subTyp === raketa.subTyp);
                                        return zbran.pattern.map(pat => Point.Sum(pat, raketa.poziceZasahu));
                                    }).forEach((points: Point[]) => {
                                    points.forEach(point => {
                                        if (!vysledek.some(vys => Point.Equals(point, vys)) &&
                                            point.x >= 0 && point.x <= 20 && point.y >= 0 && point.y <= 20)
                                            vysledek.push(point);
                                    });
                                });
                                this._vystrely.next(vysledek);
                            });
                        });
                    }
                });
            }
        });
        this.placedShips = this._placedShips.asObservable().pipe(skip(1));

        this.ships$ = afs.collection<LodData>('Lode', ref => ref.orderBy('rank')).get().pipe(
            map(lode => lode.docs.map(lod => lod.data() as LodData)),
        );
        this.ships$.subscribe(lode => {
            this.ships = lode;
        });

        this.limits$ = afs.doc('BackendData/Lode').get().pipe(map(doc => doc.data().limits as Limits));
        this.limits$.subscribe(limits => {
            this._limits.next(limits);
        });
        this.limits = this._limits.asObservable();
        this.limits.subscribe((data) => this.Limits = data);

        this.shipSelected = this._shipSelected.asObservable().pipe(skip(1));

        ls.userloaded.subscribe((data: boolean) => {
            if (data && this.ls.userData.lastMatch.lastMatchUid !== '')
                this.mms.getMyMatch().subscribe((match: Match) => {
                    if (this.Rozmisteno !== match.rozmisteno)
                        this._rozmisteno.next(match.rozmisteno);
                });
        });
    }

    public swapField() {
        if (this.ActualField === Field.playerField)
            this._actualField.next(Field.enemyField);
        else this._actualField.next(Field.playerField);
    }

    public changeMode(mode: Mode) {
        switch (mode) {
            case Mode.PlaceShips:
                this._actualField.next(Field.playerField);
                break;
            case Mode.Attack:
                this._actualField.next(Field.enemyField);
                break;
            case Mode.HeavyAttack:
                this._actualField.next(Field.enemyField);
                break;
            case Mode.SpecAbility:
                // Todo spec abil. impl.
                console.error('spec. abil. není implementována!');
                break;
            case Mode.MoveShips:
                this._actualField.next(Field.playerField);
                break;
            case Mode.SafeCraw:
                this._actualField.next(Field.playerField);
                break;
            case Mode.Nada:
                this._actualField.next(Field.playerField);
                break;
            default:
                console.error('neocekavana hodnota!');
        }

        this._actualMode.next(mode);
    }

    public lodPolozina(rank: number, lode?: LodDoc[]) {
        if (this.Limits[rank] === 0) return;
        this.Limits[rank]--;
        if (this.Limits[rank] === 0) {
            if (this.ships[rank] == null) {
                this.changeMode(Mode.Nada);
                if (lode != null)
                    this.ls.afa.idToken.subscribe(token => {
                        this.http.post(`${environment.urlBase}/matches/setLode`,
                            {lode: lode, token: token}).subscribe();
                    });
            } else this._shipSelected.next(this.ships[rank]);
        }
        this._limits.next(this.Limits);
    }

    public lodZvednuta(rank: number) {
        this.Limits[rank]++;
        this._limits.next(this.Limits);
    }

    public selectShip(data: LodData) {
        this._shipSelected.next(data);
    }

    public setWeapon(wea: AbilityData) {
        this._actualWeapon.next(wea);
    }
}

export enum Field {
    playerField = 1,
    enemyField = 2
}

export enum Mode {
    Nada = 0,
    Attack = 1,
    HeavyAttack = 2,
    SpecAbility = 3,
    MoveShips = 4,
    SafeCraw = 5,
    PlaceShips = 6
}
