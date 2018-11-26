import * as functions from "firebase-functions";
import {Hrac} from "../../../Vylepsenelode/src/app/model/hrac.model";
import * as admin from "firebase-admin";

export const userRegistred = functions.auth.user()
    .onCreate((user, context) => {
        // vytvoreni dat
        const hrac : Hrac = {
            uid: user.uid,
            nickName: 'honzík :)',
            lastMatch: {state: 2, creator: false, lastMatchRef: ''}
        };
        return admin.firestore().collection('Users').doc(user.uid).set(hrac);
});

export const userDeleted = functions.auth.user()
    .onDelete((user, context) => {
        // smazani uzivatelských dat z firestore
        return admin.firestore().collection('Users').doc(user.uid).delete();
});
