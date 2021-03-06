import { AngularFirestore } from '@angular/fire/firestore';
import { MatchListData } from "../match-making/interfaces";
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from "rxjs";
import { Match } from "../model/match.model";
import { Hrac } from "../model/hrac.model";
import { Injectable } from '@angular/core';
import {first, map} from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";
import { UserInfo } from 'firebase';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';
import { AngularFireStorage } from '@angular/fire/storage';
import { MessagingService } from "./messaging.service";
import {MessageModel} from '../model/message.model';

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
        public afstorage: AngularFireStorage,
        public ls: LoginService,
        public http: HttpClient,
        public ms: MessagingService,
    ) {}

    init(limit: number){
        this._data = new BehaviorSubject({data: [], poslednistranka: false, prvnistranka: false});
        this.data = this._data.asObservable();

        const ref = this.getCollection('Matches', refe =>
            refe.limit(limit + 1)
                .where('inLobby', '==', true)
                .where('isPublic', '==', true)
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
        this.afa.idToken.pipe(first())
            .subscribe((token) => {

            this.http.post(`${environment.urlBase}/matches/createGame`, {
                token: token,
                type: groupType,
                name: roomName,
                password: password,
                messagingToken: this.ms.token
            }).subscribe(callback);

        });
    }
    joinMatch(matchUid: string, password? : string, groupType?: string) {
        this.afa.idToken.subscribe((idToken) => {
            const body = {
                token: idToken,
                matchUid: matchUid,
                password: password === undefined ? '' : password,
                messagingToken: this.ms.token,
            };
            if(groupType === 'Veřejná')
                this.http.post(`${environment.urlBase}/matches/joinGame/public`, body).subscribe();
            if(groupType === 'Privátní')
                this.http.post(`${environment.urlBase}/matches/joinGame/private/send`, body).subscribe();
        });
    }

    public ready(){
        return new Promise((res, rej) => {
            this.ls.afa.idToken.subscribe((idToken) => {
                this.http.post(`${environment.urlBase}/matches/userReady`, {
                    token: idToken
                }).subscribe(res, rej);
            });
        });
    }

    public getMyMatch = () => this.afs.collection('Matches').doc(this.ls.userData.lastMatch.lastMatchUid).valueChanges();
    public qetProfileImageUrlByUid(uid: string) : Promise<string>{
        return new Promise((res, rej) => {
            this.afstorage.ref(`users/${uid}/profileImage.jpg`).getDownloadURL().subscribe((url) => {
                res(url);
            }, (err) => {
                this.afstorage.ref('users/defaul-user.img.jpg').getDownloadURL().subscribe((url) => {
                    res(url);
                }, rej);
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
                .where('isPublic', '==', true)
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
