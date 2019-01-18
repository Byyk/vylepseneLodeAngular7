import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { LoginService } from '../services/login.service';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, Event} from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import {MessagingService} from "../services/messaging.service";
import {faQuestion} from '@fortawesome/free-solid-svg-icons';
import {NavbarServiceService} from "../services/navbar-service.service";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user$: Observable<User>;
  profilePopUpVisible = false;
  faQuestion = faQuestion;

  transparentNavbar = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
      private breakpointObserver: BreakpointObserver,
      public LService: LoginService,
      public router: Router,
      private route: ActivatedRoute,
      private mms: MessagingService,
      public ns: NavbarServiceService
  ) {}

  ngOnInit(): void {
      this.user$ = this.LService.getUserObservable();
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
