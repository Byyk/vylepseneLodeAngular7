import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { LoginService } from '../services/login.service';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, Event} from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import {MessagingService} from "../services/messaging.service";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user$: Observable<User>;

  transparentNavbar = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
      private breakpointObserver: BreakpointObserver,
      public LService: LoginService,
      public router: Router,
      private route: ActivatedRoute,
      private mms: MessagingService
  ) {}

  ngOnInit(): void {
      this.user$ = this.LService.getUserObservable();
      this.router.events.subscribe((event: Event) => {
        if(event instanceof NavigationEnd)
          {
            this.transparentNavbar = event.url === '/Login' || event.url === '/passwordreset';
          }
      });
      this.LService.afa.idToken.subscribe(token =>{
        console.log(token);
        console.log(this.mms.token);
      });
  }

  logout(){
    this.LService.logout();
    this.router.navigate(['/']);
  }
  goBack() {
    window.history.back();
  }
}
