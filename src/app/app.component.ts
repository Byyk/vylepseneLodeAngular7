import {Component, AfterViewInit, OnInit} from '@angular/core';
import { MessagingService } from "./services/messaging.service";
import { environment } from '../environments/environment';
import {CookieService} from 'ngx-cookie-service';
import {BehaviorSubject} from 'rxjs';
import { detektorDevTools } from './model/devtools.event';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit{
    public isCookiesEnabled$ = new BehaviorSubject(this.isCookiesEnabled());

    message;
    constructor(
        public ms: MessagingService,
        public cs: CookieService
    ){
        detektorDevTools();
        ms.getPermission();
        ms.receiveMessage();
        this.message = ms.currentMessage.asObservable();
        if(environment.production) setInterval(() => console.clear(), 1000);

        window.addEventListener('devtoolschange', (e: any) => {
            if(environment.production)
                while (true){
                    console.clear();
                }
        });
  }

  ngAfterViewInit(): void {
        if(environment.production)
            console.clear();
  }

    ngOnInit(){
    }

    isCookiesEnabled(): boolean {
        return this.cs.check('cookies-enabled');
    }

    enableCookies(): void {
        this.cs.set('cookies-enabled',  'enabled!', Date.now() + (10 * 365 * 24 * 60 * 60));
        this.isCookiesEnabled$.next(true);
    }

    deleteAllCookiesAndNavigateToBlank(){
        this.isCookiesEnabled$.next(false);
        this.cs.deleteAll();
        window.location.href="about:blank";
    }
}


