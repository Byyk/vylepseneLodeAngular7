import { Component } from '@angular/core';
import {MessagingService} from './services/messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public message$;
  constructor(
    private messaging: MessagingService
  ) {
    messaging.getPermission();
    messaging.receiveMessage();
    this.message$ = messaging.currentMessage.asObservable();
  }
}
