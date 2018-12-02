import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

import * as authtriggers from './auth';
import * as matchtriggers from './matches'
import { Messaging } from './messaging';
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

// messaging
export const messaging = functions.https.onRequest( Messaging() );
