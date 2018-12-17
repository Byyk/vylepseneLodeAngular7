import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {MessageModel} from '../model/message.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {LoginService} from './login.service';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatchChatService {

    private _messages: BehaviorSubject<MessageModel[]>;
    public messages: Observable<MessageModel[]>;

    public newMessage: Observable<MessageModel>;

    private lastEntry: any;

    constructor(
        private afs: AngularFirestore,
        private ls: LoginService,
        private http: HttpClient
    ) { }

    init(){
        this._messages = new BehaviorSubject(null);
        this.messages = this._messages.asObservable();

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
        ).subscribe((data: []) => {
            if(data == null) return;
            if(data.length > 10) {
                this.lastEntry = data[data.length - 1];
                data.splice(10,1);
            }
            data.reverse();
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
}