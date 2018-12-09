import {stavyMatche} from '../match-making/match-making.component';

export interface Hrac {
    uid: string;
    nickName: string;
    lastMatch: LastMatch;
}

export interface LastMatch {
    creator: boolean;
    state: stavyMatche;
    lastMatchUid: any;
}

