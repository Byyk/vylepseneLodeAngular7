export interface Match {
    uid: string;
    roomName: string;
    groupType: string;
    inLobby: boolean;
    ended: boolean;
    isPublic: boolean;
    creatorUid: string;
    oponentUid: string;
    creatorsNickName: string;
    oponentsNickName: string;
    havepassword: boolean;
    messagingToken: string;
}

export class MatchPrivateData {
    uid: string;
    password: string;
    creatorsToken: string;
}
