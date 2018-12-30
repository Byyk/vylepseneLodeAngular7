import { Component, OnInit } from '@angular/core';
import {BreakpointObserver} from "@angular/cdk/layout";
import {Breakpointy} from "../model/breakpoints.model";
import {LoginService} from '../services/login.service';
import {Hrac} from '../model/hrac.model';

export enum stavyMatche { inLobby = 0, inGame = 1, inMenu = 2}

@Component({
  selector: 'app-match-making',
  templateUrl: './match-making.component.html',
  styleUrls: ['./match-making.component.css']
})
export class MatchMakingComponent extends Breakpointy implements OnInit {
  public stavy: stavyMatche;

  constructor(
      public breakpointObserver: BreakpointObserver,
      public ls: LoginService
  ) {
      super(breakpointObserver);
      this.ls.userDataObservable.subscribe((data : Hrac) =>{
          this.stavy = data.lastMatch.state;

          if(this.ls.userData.lastMatch !== null)
              this.stavy = this.ls.userData.lastMatch.state;
          else this.stavy = 2;
      });
  }
  ngOnInit(){

  }

}
