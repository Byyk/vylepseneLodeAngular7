import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Hrac} from "../../model/hrac.model";
import {Breakpointy} from "../../model/breakpoints.model";
import {BreakpointObserver} from "@angular/cdk/layout";
import {LoginService} from '../../services/login.service';
import {Match} from '../../model/match.model';
import {MatchMakingService} from '../../services/match-making.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent extends Breakpointy implements OnInit {

    match$: Observable<Match>;
    hrac$: Observable<Hrac>;
    souper$: Observable<Hrac>;

    oponentsPhotoUrl$: Observable<string>;

    constructor(
        public bpo: BreakpointObserver,
        public ls: LoginService,
        public mms: MatchMakingService
    ) {
        super(bpo);
        this.match$ = this.mms.getMyMatch() as Observable<Match>;
        this.hrac$ = this.ls.userDataObservable;
        this.match$.subscribe((data) => {
            if(data.oponentUid !== "")
            {
                this.souper$ = this.ls.afs.doc<Hrac>(`Users/${data.oponentUid}`).valueChanges();
                console.log(this.ls.userData.uid);
                console.log(data.creatorUid);
                console.log(data.creatorUid === this.ls.userData.uid);
                if(data.creatorUid === this.ls.userData.uid)
                    this.oponentsPhotoUrl$ = this.mms.qetProfileImageUrlByUid(data.oponentUid);
                else if(data.oponentUid === this.ls.userData.uid)
                    this.oponentsPhotoUrl$ = this.mms.qetProfileImageUrlByUid(data.creatorUid);
            }
        });
    }

    ngOnInit() {
    }

}
