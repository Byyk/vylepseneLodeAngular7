import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

import * as authtriggers from './auth';

import { Users } from "./users";
import { Matches } from './matches';

admin.initializeApp();

// users API endpoint
export const users = functions.https.onRequest(Users());

// matches API endpoint
export const matches = functions.https.onRequest(Matches());

// auth triggers
export const userRegistred = authtriggers.userRegistred;
export const userDeleted = authtriggers.userDeleted;
