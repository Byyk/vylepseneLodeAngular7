import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {MessageModel} from '../model/message.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {LoginService} from './login.service';
import {map, skip} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatchChatService {

        private _messages: BehaviorSubject<MessageModel[]>;
        public messages: Observable<MessageModel[]>;

        private _end: BehaviorSubject<boolean>;
        public end: Observable<boolean>;

        public newMessage: Observable<MessageModel>;

        private lastEntry: any = null;

        constructor(
            private afs: AngularFirestore,
            private ls: LoginService,
            private http: HttpClient
        ) { }

        init(){
            this._messages = new BehaviorSubject(null);
            this.messages = this._messages.asObservable();

            this._end = new BehaviorSubject(false);
            this.end = this._end.asObservable().pipe(skip(1));

            this.newMessage = this.afs.collection<MessageModel>('Messages', quarry =>
                quarry.orderBy('timestamp', 'desc')
                    .where('MatchUid', '==', this.ls.userData.lastMatch.lastMatchUid)
                    .where('type', '==', 'match-message')
                    .limit(1)
            ).valueChanges().pipe(map(d => d[0]));

            this.getCollection('Messages', quarry =>
                quarry.orderBy('timestamp', 'desc')
                    .where('MatchUid', '==', this.ls.userData.lastMatch.lastMatchUid)
                    .where('type', '==', 'match-message')
                    .limit(11)
            ).pipe(map(this.resolveMatchList)).subscribe((data: []) => {
                this._messages.next(data);
            });

        }

        public sendMessage(message: string) : Promise<string> {
        return new Promise((res, rej) => {
            const ref = this.ls.afa.idToken.subscribe((token) => {
                this.http.post(`${environment.urlBase}/matches/sendMessage`, {
                    token: token,
                    message: message
                }, {responseType: 'text'}).subscribe(console.log, rej);
                ref.unsubscribe();
            });
        });
    }

        public loadNext() {
            this.getCollection('Messages', quarry =>
                quarry.orderBy('timestamp', 'desc')
                    .where('MatchUid', '==', this.ls.userData.lastMatch.lastMatchUid)
                    .where('type', '==', 'match-message')
                    .limit(11)
                    .startAfter(this.lastEntry.doc)
            ).pipe(map(this.resolveMatchList)).subscribe((data) => {
                this._messages.next(data);
            });
        }

        private getCollection(ref, quarryFn?): Observable<any>{
            return this.afs.collection(ref, quarryFn
            ).get().pipe(map(data =>
                data.docs.map(doc => {
                    const dat = doc.data();
                    const uid = doc.id;
                    return {uid, ...dat, doc};
                })
            ));
        }
        private resolveMatchList = (data: []) : [] => {
            if(data == null) return;
            if(data.length > 10) {
                this.lastEntry = data[data.length - 1];
                data.splice(10,1);
            } else this._end.next(true);
            data.reverse();
            return data;
        }

    }

