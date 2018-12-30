import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Hrac} from "../../model/hrac.model";
import {Breakpointy} from "../../model/breakpoints.model";
import {BreakpointObserver} from "@angular/cdk/layout";
import {LoginService} from '../../services/login.service';
import {Match} from '../../model/match.model';
import {MatchMakingService} from '../../services/match-making.service';
import {first} from 'rxjs/operators';

interface UserData {
    ready: boolean;
}

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent extends Breakpointy implements OnInit {

    match$: Observable<Match>;
    hrac$: Observable<Hrac>;
    souper$: Observable<Hrac>;

    oponentsPhotoUrl$: Promise<string>;

    constructor(
        public bpo: BreakpointObserver,
        public ls: LoginService,
        public mms: MatchMakingService
    ) {
        super(bpo);
        this.match$ = this.mms.getMyMatch() as Observable<Match>;
        this.hrac$ = this.ls.userDataObservable;
        this.match$.pipe(first()).subscribe((data) => {
            if(data.oponentUid !== "")
            {
                this.souper$ = this.ls.afs.doc<Hrac>(`Users/${data.oponentUid}`).valueChanges();
                if(data.creatorUid === this.ls.userData.uid)
                    this.oponentsPhotoUrl$ = this.mms.qetProfileImageUrlByUid(data.oponentUid);
                else if(data.oponentUid === this.ls.userData.uid)
                    this.oponentsPhotoUrl$ = this.mms.qetProfileImageUrlByUid(data.creatorUid);
            }
        });
    }
    ngOnInit() {
    }
    public MyData(match: Match) : UserData{
        if(match.creatorUid === this.ls.userData.uid)
            return { ready: match.creatorReady };
        else return { ready: match.oponentReady };
    }
    public OponentsData(match: Match) : UserData{
        if(match.creatorUid !== this.ls.userData.uid)
            return { ready: match.creatorReady };
        else return { ready: match.oponentReady };
    }
    public ready(){
        this.mms.ready().then().catch((err) => {
            if(confirm('stala se chyba při odesílní na server, chcete to zkusit znovu?')){
                this.ready();
            }
        });
    }
}
