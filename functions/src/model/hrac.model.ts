enum stavyMatche { inLobby = 0, inGame = 1, inMenu = 2}

export interface Hrac {
    uid: string;
    nickName: string;
    lastMatch: LastMatch;
}

export interface LastMatch {
    creator: boolean;
    state: stavyMatche;
    lastMatchUid: any;
    ready: boolean;
}

