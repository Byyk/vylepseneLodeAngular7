import { Injectable } from '@angular/core';
import { MyBoardModel} from '../model/my-board.model';
import {MatchMakingService} from './match-making.service';
import {LoginService} from './login.service';
import {AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import {HttpClient} from '@angular/common/http';
import {Storage, StorageBuilder} from '../Data-Storage/Storage';
import {Match} from '../model/match.model';
import {TahModel} from '../model/tah.model';
import {LodeDto} from '../model/lod.model';
import {Raketa, Rakety} from '../model/raketa.model';
import {firestore} from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class Gs2Service {
    public myboard = new MyBoardModel();
    private storage: Storage<GameState>;

    constructor(
        public mms: MatchMakingService,
        public ls: LoginService,
        private afs: AngularFirestore,
        private http: HttpClient
    ) {
        this.storage = this.buildStorage();
        this.sbirej();
    }

    private buildStorage() {
        return StorageBuilder.Build<GameState>([
            {name: emitors.matchloaded, checker: (data) => data.match != null}
        ]);
    }

    private sbirej() {
        this.ls.userloaded.subscribe((prihlaseny) => {
           if(prihlaseny) {
               const matchUid = this.ls.userData.lastMatch.lastMatchUid;
               this.storage.collect(this.afs.doc(`Matches/${ matchUid }`).get(), zpracujMatch);
               this.storage.collect(this.afs.collection(`Matches/${ matchUid }/Tahy`).valueChanges(), zpracujTahy);
               this.storage.collect(this.afs.collection(`Matches/${ matchUid }/Lode`).snapshotChanges(), zpracujLode);
           } else this.storage.clear();
        });
        this.storage.collect(this.afs.collection('Rakety').get(), zpracujUtoky);
        this.storage.getEmitor(emitors.matchloaded).subscribe(data => console.log(data, this.storage.getData()));
    }
}

export interface GameState {
    match? : Match;
    tahy? : TahModel;
    lode? : LodeDto;
    utoky? : Raketa[];
}

const emitors = {
    matchloaded: 'matchloaded'
};

const dataFromDoc = (doc) => doc.data();
const zpracujMatch = (doc) => ({ match: dataFromDoc(doc) });
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
                typ: _utoky.id,
                subTyp: key,
                pattern: _utoky[key].pattern,
                type: _utoky.type,
                cooldown: _utoky.cooldown
            } as Raketa);
        }
    }
    return {utoky: ret};
};
