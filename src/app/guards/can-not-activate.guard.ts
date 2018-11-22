import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from "../services/login.service";

@Injectable({
  providedIn: 'root'
})
export class CanNotActivateGuard implements CanActivate {
  constructor(public ls: LoginService){}
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return !this.ls.LogginedIn;
  }
}
