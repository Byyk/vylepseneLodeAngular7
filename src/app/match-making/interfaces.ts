import {Match} from "../model/match.model";

export interface MatchListData {
    data: Array<Match> ;
    poslednistranka: boolean;
    prvnistranka: boolean;
}

export interface UserMatch {
    matches: Match[];
    user: HracDTO[];
}

export interface HracDTO {
    uid:  string;
    nickName: string;
}
