import {Match} from "../model/match.model";

export interface MatchListData {
    data: Array<Match> ;
    poslednistranka: boolean;
    prvnistranka: boolean;
}
