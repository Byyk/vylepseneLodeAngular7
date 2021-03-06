import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from 'firebase';


/*
*
* Credit https://angularfirebase.com/lessons/send-push-notifications-in-angular-with-firebase-cloud-messaging/
*
* */
@Injectable({
  providedIn: 'root'
})
export class MessagingService {
    messaging = firebase.messaging();
    currentMessage = new BehaviorSubject(null);
    token: string;

    constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) { }


    updateToken(token) {
        this.afAuth.user.subscribe(user => {
            if (!user) return;
                this.afs.doc(`Users/${user.uid}`).update({messagingToken: token});
                this.token = token;
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
            console.log(payload);
        });
    }
}
