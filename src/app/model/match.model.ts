import {Hrac} from "./hrac.model";
import {Observable} from "rxjs";

export interface Match {
    uid: string;
    roomName: string;
    password: string;
    groupType: string;
    inLobby: boolean;
    ended: boolean;
    creatorUid: string;
    oponentUid: string;
}
