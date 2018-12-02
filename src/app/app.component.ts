import { Component } from '@angular/core';
import {MessagingService} from "./services/messaging.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  message;
  constructor(
      public ms: MessagingService
  ){
    ms.getPermission();
    ms.receiveMessage();
    this.message = ms.currentMessage;
  }
}
