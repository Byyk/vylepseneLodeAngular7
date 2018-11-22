export interface Hrac {
    uid: string;
    nickName: string;
    lastMatch: LastMatch;
}

export interface LastMatch {
    creator: boolean;
    lastMatchRef: any;
}
