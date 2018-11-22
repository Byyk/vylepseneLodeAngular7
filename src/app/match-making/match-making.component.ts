import { Component, OnInit } from '@angular/core';
import {BreakpointObserver} from "@angular/cdk/layout";
import {Breakpointy} from "../model/breakpoints.model";
import {MatchMakingService} from "../services/match-making.service";

export enum stavyMatche { inLobby, inGame, inMenu, Joining }

@Component({
  selector: 'app-match-making',
  templateUrl: './match-making.component.html',
  styleUrls: ['./match-making.component.css']
})
export class MatchMakingComponent extends Breakpointy implements OnInit {
  public stavy: stavyMatche;

  constructor(
      public breakpointObserver: BreakpointObserver,
      public mms: MatchMakingService
  ) {
      super(breakpointObserver);
      this.stavy = stavyMatche.inMenu;
  }
  ngOnInit(){

  }

}
