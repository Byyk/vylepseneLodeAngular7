import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFirestore} from "@angular/fire/firestore";
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
    messaging = firebase.messaging();
    currentMessage = new BehaviorSubject(null);

    constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) { }


    updateToken(token) {
        this.afAuth.user.subscribe(user => {
            if (!user) return;
            this.afs.doc(`Users/${user.uid}`).update({messagingToken: token});
        });
    }

    getPermission() {
        this.messaging.requestPermission()
            .then(() => {
                return this.messaging.getToken();
            })
            .then(token => {
                this.updateToken(token);
            })
            .catch((err) => {
            });
    }

    receiveMessage() {
        this.messaging.onMessage((payload) => {
            this.currentMessage.next(payload);
        });
    }
}
