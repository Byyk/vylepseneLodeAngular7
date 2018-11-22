import { Component, OnInit } from '@angular/core';
import {MatchMakingService} from "../../../services/match-making.service";
import {HttpClient} from "@angular/common/http";
import {HracDTO, UserMatch} from "../../interfaces";

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css']
})
export class JoinGameComponent implements OnInit {
    public displayedColumns: string[] = ['state', 'public', 'cratorsNick', 'actions'];
    public pageSizeOptions: number[] = [5, 10, 20];
    public listMatchData: UserMatch = {user: [], matches: []};
    public pagelimit = 5;
    public nextButtonDisenabled: boolean;
    public prevButtonDisenabled = true;

    constructor(
        public mms: MatchMakingService,
        public http: HttpClient
    ) {}

    ngOnInit() {
        this.mms.init(5);
        this.mms.data.subscribe(data => {
            this.nextButtonDisenabled = data.poslednistranka;
            this.prevButtonDisenabled = data.prvnistranka;
            if(data.data.length === 0) return;

            console.log(data); // Todo je vidět heslo!, alespoň přidat hash!

            const restApiUrl = `https://us-central1-lode-1835e.cloudfunctions.net/users/getUsers?antiCashingToken=${this.mms.afs.createId()}`;
            return this.http.post<HracDTO[]>(
                restApiUrl,
                data.data.map(match => match.creatorUid)
            ).subscribe(res => {
                this.listMatchData = {
                    matches: data.data,
                    user: res
                };
                console.log(this.listMatchData);
            });
        });
    }

    next(){
        if(this.nextButtonDisenabled) return;
        this.mms.next(this.pagelimit);
    }
    prev(){
        if(this.prevButtonDisenabled) return;
        this.mms.prev(this.pagelimit);
    }
    join(uid: string){
        this.mms.joinMatch(uid);
    }
    selectedValueChnaged = ($event) => this.pagelimit = $event;
}
