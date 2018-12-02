import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../services/messaging.service';
import { Notification } from './message/message.component';

@Component({
  selector: 'app-message-container',
  templateUrl: './message-container.component.html',
  styleUrls: ['./message-container.component.scss']
})
export class MessageContainerComponent implements OnInit {


    public messages: Notification[] = [];

    constructor(
        public ms: MessagingService
    ) {
        this.ms.currentMessage.asObservable().subscribe(data =>{
            if(data !== null)
                this.messages.push(data.notification);
        });
    }

    closed(id){
        this.messages.splice(id, 1);
    }

    ngOnInit() {
    }

}
