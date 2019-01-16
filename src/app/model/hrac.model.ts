import {stavyMatche} from '../match-making/match-making.component';

export interface Hrac {
    uid: string;
    nickName: string;
    lastMatch: LastMatch;
    golds: number;
}

export interface LastMatch {
    creator: boolean;
    state: stavyMatche;
    lastMatchUid: any;
    ready: boolean;
}

