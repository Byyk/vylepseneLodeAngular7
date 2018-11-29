import { Injectable } from '@angular/core';
import {AngularFireMessaging} from "@angular/fire/messaging";
import {BehaviorSubject, Observable} from "rxjs";
import {AngularFireAuth} from "@angular/fire/auth";
import {take} from "rxjs/operators";
import {MatchMakingService} from "./services/match-making.service";
import {AngularFirestore} from "@angular/fire/firestore";
import {LoginService} from "./services/login.service";
import {MessageModel} from "./model/message.model";

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  public token$: Observable<string | null>;
  public token: string;
  public listeners: string[];

  private _incomingMesagge = new BehaviorSubject(null);
  public IncomingMessage: Observable<MessageModel>;

  set Listeners( value: string[] ){
    const i = this.listeners.indexOf(this.token, 0);
    delete this.listeners[i];
  }

  constructor(
      public m: AngularFireMessaging,
      public afa: AngularFireAuth,
      public afs: AngularFirestore,
      public mms: MatchMakingService,
      public ls: LoginService
  ) {
    this.IncomingMessage = this._incomingMesagge.asObservable();
    this.token$ = m.getToken;
    this.token$.subscribe(token => {
      this.token = token;
    });

    m.messaging.subscribe(
        _messaging => {
          _messaging.onTokenRefresh = this.updateToken.bind(_messaging);
          _messaging.onMessage = this.updateToken.bind(_messaging);
        }
    );
  }

  updateToken(userId, token) {
    this.afa.authState.pipe(
        take(1),
    ).subscribe(
        () => {
            return this.afs.doc(`${this.ls.userData.lastMatch.lastMatchRef}`).collection('messagingListeners').doc(userId)
                .set({
                    uid: userId,
                    token: token
                    });
        }
    );
  }

  getMessage(){
    this.m.messages.subscribe(
        (payload) => {
          this._incomingMesagge.next(payload);
        }
    );
  }

  requestPermission(userId){
    this.m.requestToken.subscribe(
        (token) => {
          this.updateToken(userId, token);
        },
        (err) => {
          console.error('Unable to get permission to notify.', err)
        }
    );
  }
}
