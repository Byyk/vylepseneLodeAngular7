import { Component, AfterViewInit } from '@angular/core';
import { MessagingService } from "./services/messaging.service";
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  message;
  constructor(
      public ms: MessagingService
  ){
    ms.getPermission();
    ms.receiveMessage();
    this.message = ms.currentMessage.asObservable();
     if(environment.production) setInterval(() => console.clear(), 1000);
  }

  ngAfterViewInit(): void {
      if(environment.production)
          console.clear();
  }
}


