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
                console.log('Notification permission granted.');
                return this.messaging.getToken();
            })
            .then(token => {
                console.log(token);
                this.updateToken(token);
            })
            .catch((err) => {
                console.log('Unable to get permission to notify.', err);
            });
    }

    receiveMessage() {
        this.messaging.onMessage((payload) => {
            console.log("Message received. ", payload);
            this.currentMessage.next(payload);
        });
    }
}
