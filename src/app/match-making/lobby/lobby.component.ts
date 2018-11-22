import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Hrac} from "../../model/hrac.model";
import {Breakpointy} from "../../model/breakpoints.model";
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent extends Breakpointy implements OnInit {

    hrac$: Observable<Hrac>;
    souper$: Observable<Hrac>;

    constructor(public bpo: BreakpointObserver) {
        super(bpo);
    }

    ngOnInit() {
    }

}
