import { Injectable } from '@angular/core';
import {AbilityData, MyBoardModel} from '../model/my-board.model';
import {MatchMakingService} from './match-making.service';
import {LoginService} from './login.service';
import {AngularFirestore, DocumentChangeAction, DocumentSnapshot} from '@angular/fire/firestore';
import {HttpClient} from '@angular/common/http';
import {Storage, StorageBuilder} from '../Data-Storage/Storage';
import {Match} from '../model/match.model';
import {TahModel, Utok} from '../model/tah.model';
import {LodData, LodDoc, LodeDto} from '../model/lod.model';
import {Raketa, Rakety} from '../model/raketa.model';
import {firestore} from 'firebase';
import {BehaviorSubject} from 'rxjs';
import {Limits} from './game.service';
import {environment} from '../../environments/environment';
import {Point} from '../model/pole.model';
import {Hrac} from "../model/hrac.model";

@Injectable({
  providedIn: 'root'
})
export class Gs2Service {
    public myboard = new MyBoardModel();
    public boardsState = new BehaviorSubject<BoardsState>({field: Field.playerField, mode: Mode.Nada});
    public selectedShip = new BehaviorSubject<LodData>(null);
    public selectedWeapon = new BehaviorSubject<AbilityData>(null);
    public storage: Storage<GameState>;

    constructor(
        public mms: MatchMakingService,
        public ls: LoginService,
        private afs: AngularFirestore,
        private http: HttpClient
    ) {
        this.storage = Gs2Service.buildStorage();
        this.sbirej();
    }

    private static buildStorage() {
        return StorageBuilder.Build<GameState>([
            {name: emitors.match_ready, checker: isDataForMatchReady},
            {name: emitors.rozmisteno, checker: data => data.match == null ? false : data.match.rozmisteno}
        ], [
            {name: transformers.dopady, transformer: dopadTransformer.bind(false), checker: dopadTransformerChecker}
        ]);
    }
    private sbirej() {
        this.ls.userloaded.subscribe((prihlaseny) => {
           if(prihlaseny) {
               const matchUid = this.ls.userData.lastMatch.lastMatchUid;
               this.storage.collect(this.afs.doc(`Matches/${ matchUid }`).valueChanges(), zpracujMatch);
               this.storage.collect(this.afs.collection(`Matches/${ matchUid }/Tahy`).valueChanges(), zpracujTahy);
               this.storage.collect(this.afs.collection(`Matches/${ matchUid }/Lode`).snapshotChanges(), zpracujLode);
           } else this.storage.clear();
        });
        this.storage.collect(this.afs.collection('Rakety').get(), zpracujUtoky);
        this.storage.collect(this.afs.collection('Lode').get(), zpracujDataLodi);
        this.storage.collect(this.afs.doc('BackendData/Lode').get(), zpracujLimity);
        this.ls.afa.user.subscribe(user => {
            if(user != null)
                this.storage.collect(this.ls.userDataObservable, (data) => ({userData: data}));
            else
                this.storage.updateData(data => data.userData = null);
        });
    }
    public swapField() {
        if(this.boardsState.value.field === Field.playerField)
            this.boardsState.next({field: Field.enemyField, mode: this.boardsState.value.mode});
        else this.boardsState.next({field: Field.playerField, mode: this.boardsState.value.mode});
    }
    public setWeapon(wea: AbilityData) {
        this.selectedWeapon.next(wea);
    }
    public changeMode(mode: Mode) {
        if(fieldMode.hasOwnProperty(mode))
            this.boardsState.next({field: fieldMode[mode], mode: mode});
        else this.boardsState.next({field: this.boardsState.value.field, mode: mode});
    }
    public selectShip(data: LodData) {
        this.selectedShip.next(data);
    }
    public lodPolozina(rank: number, lode?: LodDoc[]) {
        const limits = this.storage.getData(data => data.limits);
        const ships = this.storage.getData(data => data.lodedata);
        if (limits[rank] === 0) return;
        limits[rank]--;
        if (limits[rank] === 0) {
            if (ships[rank] == null) {
                this.changeMode(Mode.Nada);
                if (lode != null)
                    this.ls.afa.idToken.subscribe(token => {
                        this.http.post(`${environment.urlBase}/matches/setLode`,
                            {lode: lode, token: token}).subscribe();
                    });
            } else this.selectedShip.next(ships[rank]);
        }
        this.storage.updateData(data => data.limits = limits);
    }
}

export interface GameState {
    match? : Match;
    tahy? : TahModel[];
    lode? : LodeDto;
    utoky? : Raketa[];
    lodedata? : LodData[];
    limits? : Limits;
    userData? : Hrac;
}

export interface BoardsState {
    mode: Mode;
    field: Field;
}

export const emitors = {
    match_ready: 'match_ready',
    rozmisteno: 'rozmisteno',
};
export const transformers = {
    dopady: 'dopady'
};

// data formators
const zpracujMatch = (doc) => ({ match: doc});
const zpracujTahy = (tahy) => ({ tahy });
const zpracujLode = (docs : DocumentChangeAction<any>[]) => {
    const ret = {};
    for(const doc of docs) {
        ret[doc.payload.doc.id] = doc.payload.doc.data();
    }
    return {lode: ret};
};
const zpracujUtoky = (docs: firestore.QuerySnapshot) => {
    const ret = [];
    for(const utoky of docs.docs) {
        const _utoky = utoky.data();
        for(const key in utoky.data()) {
            if(typeof _utoky[key] === "number") continue;
            ret.push({
                typ: utoky.id,
                subTyp: key,
                pattern: _utoky[key].pattern,
                type: _utoky.type,
                cooldown: _utoky.cooldown
            } as Raketa);
        }
    }
    return {utoky: ret};
};
const zpracujDataLodi = (docs: firestore.QuerySnapshot) => {
    const ret = [];
    for(const doc of docs.docs) {
        ret.push(doc.data());
    }
    return { lodedata: ret };
};
const zpracujLimity = (doc: DocumentSnapshot<any>) => ({limits: doc.data().limits as Limits});

// Checkers
const isDataForMatchReady = (data: GameState) => data.limits != null && data.userData != null && data.match != null &&
    data.utoky != null && data.lodedata != null && (!data.match.rozmisteno || (data.tahy != null && data.lode != null));
const dopadTransformerChecker = (data: GameState) => data.tahy != null && data.utoky != null;

// Transformers
const dopadTransformer = (data: GameState, creator: boolean) => {
    const rakety = data.utoky;
    const vysledek = [];
    let isCreator;
    for(const tah of data.tahy) {
        isCreator = data.userData.lastMatch.creator;
        if(tah.seenFor === (creator ? isCreator : !isCreator) ? 'creator' : 'opponent') {
            for(const point of rakety.find(raketa => raketa.subTyp === tah.tahData.subTyp).pattern) {
                const zasah = Point.Sum(point, tah.tahData.poziceZasahu);
                if(!vysledek.some(vys => Point.Equals(vys, zasah)))
                    vysledek.push(zasah);
            }
        }
    }
    return vysledek;
};

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
const fieldMode = {
    0: Field.playerField,
    1: Field.enemyField,
    2: Field.enemyField,
    4: Field.playerField,
    5: Field.playerField,
    6: Field.playerField
};
