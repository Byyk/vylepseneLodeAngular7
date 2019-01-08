import { Injectable } from '@angular/core';
import {MyBoardModel} from '../model/my-board.model';
import {MatchMakingService} from './match-making.service';
import {LoginService} from './login.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, forkJoin, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Limits} from './game.service';

@Injectable({
  providedIn: 'root'
})
export class Gs2Service {
    public myboard = new MyBoardModel();

    private _gameDataReady = new BehaviorSubject<boolean>(false);
    public gameDataReady: Observable<boolean>;

    constructor(
        public mms: MatchMakingService,
        public ls: LoginService,
        private afs: AngularFirestore,
        private http: HttpClient
    ) {
        this.gameDataReady = this._gameDataReady.asObservable();
        Promise.all([
            this.loadMatch(),
            this.loadLimits()
        ]).then(() => this._gameDataReady.next(true));
    }

    loadMatch() : Promise<any> {
        return new Promise((res, rej) => {
            this.ls.userloaded.subscribe(isLoaded => {
                if(isLoaded) {
                    const matchDoc = this.afs.doc(`Matches/${this.ls.userData.lastMatch.lastMatchUid}`);
                    const o1 = matchDoc.get().pipe(tap(data => this.myboard.myBoardData.rozmisteno = data.data().rozmisteno));
                    const o2 = matchDoc.collection('Lode').doc(this.ls.userData.lastMatch.creator ? 'creator' : 'opponent')
                        .get().pipe(tap((data => {
                            if(data.exists)
                                this.myboard.myBoardData.placedShips = data.data().lode;
                        })));
                    forkJoin(o1, o2).subscribe(res, rej);
                }
            });
        });
    }
    loadLimits() : Promise<any> {
        return new Promise((res, rej) => {
            this.afs.doc('BackendData/Lode').get().pipe(tap(doc => this.myboard.myBoardData.limits = doc.data().limits as Limits)).subscribe(res, rej);
        });
    }
}
