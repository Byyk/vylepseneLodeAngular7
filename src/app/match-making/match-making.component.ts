import { Component, OnInit } from '@angular/core';
import {BreakpointObserver} from "@angular/cdk/layout";
import {Breakpointy} from "../model/breakpoints.model";
import {LoginService} from '../services/login.service';
import {Hrac} from '../model/hrac.model';
import {GameService} from '../services/game.service';
import {BehaviorSubject} from 'rxjs';

export enum stavyMatche { inLobby = 0, inGame = 1, inMenu = 2}

@Component({
  selector: 'app-match-making',
  templateUrl: './match-making.component.html',
  styleUrls: ['./match-making.component.css']
})
export class MatchMakingComponent extends Breakpointy implements OnInit {
  public State = new BehaviorSubject<stavyMatche>(undefined);

  constructor(
      public breakpointObserver: BreakpointObserver,
      public ls: LoginService,
      public gs: GameService
  ) {
      super(breakpointObserver);
  }
  ngOnInit(){
      this.ls.userloaded.subscribe(isLoaded => {
          if(isLoaded) {
              if(this.ls.userData.lastMatch !== null)
                  this.State.next(this.ls.userData.lastMatch.state);
              else this.State.next(2);
          }
      });
  }

}
