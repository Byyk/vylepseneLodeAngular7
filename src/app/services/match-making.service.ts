import { AngularFirestore } from '@angular/fire/firestore';
import { MatchListData } from "../match-making/interfaces";
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from "rxjs";
import { Match } from "../model/match.model";
import { Hrac } from "../model/hrac.model";
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

//
// zdroje:
// https://stackoverflow.com/questions/49536684/firestore-angularfire2-pagination-query-items-by-range-startafterlastvis
//

@Injectable({
  providedIn: 'root'
})
export class MatchMakingService {
    private _data: BehaviorSubject<MatchListData>;
    private lastpagelength: number;
    private lastfirstEntry = 0;
    private lastEntry: number;
    private allData = [];

    public data: Observable<MatchListData>;

    constructor(
        public afs: AngularFirestore,
        public afa: AngularFireAuth,
        public http: HttpClient
    ) {}

    init(limit: number){
        this._data = new BehaviorSubject({data: [], poslednistranka: false, prvnistranka: false});
        this.data = this._data.asObservable();

        const ref = this.getCollection('Matches', refe =>
            refe.limit(limit + 1)
                .where('inLobby', '==', true)
        ).subscribe((data: Array<any>) => {
            const ret = this.download_isFull(data, limit);
            this.download_setLastEntry(limit);
            this._data.next(ret);
            ref.unsubscribe();
        });
    }
    next(limit: number){
        if(this.lastEntry === this.allData.length - 1)
            this.downloadNext(limit);
        else{
            this.loadNext(limit);
        }
    }
    prev(limit: number){
        const data = [];

        this.lastEntry = this.lastfirstEntry - 1;
        this.lastfirstEntry = this.lastfirstEntry - limit;

        for(let i = this.lastfirstEntry; i <= this.lastEntry; i++){
            data.push(this.allData[i]);
        }

        this._data.next({data: data, poslednistranka: false, prvnistranka: this.lastfirstEntry === 0});
    }
    createMatch(roomName: string, password: string, groupType: string, callback: () => void){
        const ref = this.afs.collection<Match>('Matches');
        this.afa.user.subscribe(user => {
            ref.add({
                roomName: roomName,
                password: password,
                groupType: groupType,
                creatorUid: user.uid,
                ended: false,
                inLobby: true,
                oponentUid: "",
                uid: this.afs.createId()
            }).then(doc => {
                this.afs.collection<Hrac>('Users', refe => refe.where('uid', '==', user.uid)).get().subscribe((quarrySnapshot => {
                    quarrySnapshot.forEach((document) => {
                        document.ref.update({lastMatch: { lastMatchRef: `Matches/${doc.id}`, creator: true }}).then(callback);
                    });
                }));
            });
        });
    }
    async joinMatch(matchUid: string, password? : string) {
        this.afa.idToken.subscribe((idToken) => {
            this.http.get(`https://us-central1-lode-1835e.cloudfunctions.net/matches/${idToken}`).subscribe(data => {
                console.log(data);
            });
        });
    }
    private getCollection(ref, quarryFn?): Observable<any>{
        return this.afs.collection(ref, quarryFn)
            .snapshotChanges().pipe(
                map(actions =>
                    actions.map(a => {
                        const data = a.payload.doc.data();
                        const id = a.payload.doc.id;
                        const doc = a.payload.doc;
                        return { id, ...data, doc};
                    })
                )
            );
    }
    private download_setLastEntry(limit: number){
        this.lastEntry = this.allData.length - 1;
        this.lastfirstEntry = this.allData.length - this.lastpagelength;
    }
    private download_isFull(data: Match[], limit): MatchListData{
        let posledniStranka = false;
        if(data.length !== limit + 1){
            posledniStranka = true;
            this.lastpagelength = data.length;
        }
        else{
            data.splice(limit, 1);
            this.lastpagelength = limit;
        }
        this.allData = this.allData.concat(data);
        this.download_setLastEntry(limit);
        return { data: data, prvnistranka: this.lastfirstEntry === 0, poslednistranka: posledniStranka};
    }
    private downloadNext(limit: number){
        const ref = this.getCollection('Matches', refe =>
            refe.startAfter(this.allData[this.lastEntry].doc)
                .limit(limit + 1)
                .where('inLobby', '==', true)
        )
            .subscribe((data: any[]) => {
                const ret = this.download_isFull(data, limit);
                this._data.next(ret);
                ref.unsubscribe();
            });
    }
    private loadNext(limit: number){
        const data = [];

        this.lastpagelength = this.allData.length - this.lastEntry - 1 >= limit ? limit : this.allData.length - this.lastEntry - 1;
        this.lastfirstEntry = this.lastEntry + 1;
        this.lastEntry = this.lastEntry + this.lastpagelength;

        for(let i = this.lastfirstEntry; i <= this.lastEntry; i++){
            data.push(this.allData[i]);
        }

        this._data.next({data: data, prvnistranka: false, poslednistranka: this.lastEntry === this.allData.length - 1});
    }
}
