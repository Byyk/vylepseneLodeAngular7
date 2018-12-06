import { Component, OnInit } from '@angular/core';
import {MatchMakingService} from "../../../services/match-making.service";
import {HttpClient} from "@angular/common/http";
import {Match} from '../../../model/match.model';
import {MatDialog} from '@angular/material';
import {PasswordDialogComponent} from '../../../password-dialog/password-dialog.component';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css']
})
export class JoinGameComponent implements OnInit {
    public displayedColumns: string[] = ['state', 'public', 'cratorsNick', 'actions'];
    public pageSizeOptions: number[] = [5, 10, 20];
    public listMatchData: Match[] = [];
    public pagelimit = 5;
    public nextButtonDisenabled: boolean;
    public prevButtonDisenabled = true;

    constructor(
        public mms: MatchMakingService,
        public http: HttpClient,
        public md: MatDialog
    ) {}

    ngOnInit() {
        this.mms.init(5);
        this.mms.data.subscribe(data => {
            this.nextButtonDisenabled = data.poslednistranka;
            this.prevButtonDisenabled = data.prvnistranka;
            if(data.data.length === 0) return;
            this.listMatchData = data.data;
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
    join(uid: string, havepassword: boolean, groupType: string){
        if(havepassword && groupType === 'Veřejná')
            this.md.open(PasswordDialogComponent, {width: '300px'}).afterClosed().subscribe(data =>{
                this.mms.joinMatch(uid, data);
            });
        else this.mms.joinMatch(uid, '', groupType);
    }
    selectedValueChnaged = ($event) => this.pagelimit = $event;
}
