import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {LoginService} from "../services/login.service";

@Injectable({
  providedIn: 'root'
})
export class CanActivateGuard implements CanActivate {
    constructor(public ls: LoginService, public router: Router){}
    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        if(!this.ls.LogginedIn) this.router.navigate(['/Login']);
        return this.ls.LogginedIn;
    }
}
