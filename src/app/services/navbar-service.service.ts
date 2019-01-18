import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class NavbarServiceService {

  public _transparent = new BehaviorSubject(false);

  constructor(
      private router: Router
  ) {
    router.events.subscribe(event => {
      if(event instanceof NavigationEnd){
        switch (event.url) {
            case '/Login':
              this._transparent.next(true);
              break;
            case '/passwordreset':
              this._transparent.next(true);
              break;
            case '/':
              this._transparent.next(true);
              break;
            default:
              this._transparent.next(false);
        }
      }
    });
  }
}
