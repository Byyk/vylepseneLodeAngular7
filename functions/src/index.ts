import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

import * as authtriggers from './auth';
import * as matchtriggers from './matches'
const Matches = matchtriggers.Matches;

admin.initializeApp();
admin.firestore().settings({timestampsInSnapshots: true});

// matches API endpoint
export const matches = functions.https.onRequest(Matches());

// auth triggers
export const userRegistred = authtriggers.userRegistred;
export const userDeleted = authtriggers.userDeleted;

// match triggers
export const matchDeleted = matchtriggers.matchDeleted;
