import { Component, OnInit } from '@angular/core';
import {BreakpointObserver} from "@angular/cdk/layout";
import {Breakpointy} from "../model/breakpoints.model";
import {LoginService} from '../services/login.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {emitors, Gs2Service} from '../services/gs2.service';

export enum stavyMatche { inLobby = 0, inGame = 1, inMenu = 2}

@Component({
  selector: 'app-match-making',
  templateUrl: './match-making.component.html',
  styleUrls: ['./match-making.component.css']
})
export class MatchMakingComponent extends Breakpointy implements OnInit {
  public State = new BehaviorSubject<stavyMatche>(undefined);
  public rozmisteno: Observable<boolean>;

  constructor(
      public breakpointObserver: BreakpointObserver,
      public ls: LoginService,
      public gs2: Gs2Service
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
      this.rozmisteno = this.gs2.storage.getEmitor(emitors.rozmisteno);
  }

}
