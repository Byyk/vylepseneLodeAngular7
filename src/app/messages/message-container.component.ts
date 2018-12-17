import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../services/messaging.service';
import { Notification } from './message/message.component';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-message-container',
  templateUrl: './message-container.component.html',
  styleUrls: ['./message-container.component.scss']
})
export class MessageContainerComponent implements OnInit {


    public messages: Notification[] = [];

    constructor(
        private ms: MessagingService,
        private afa: AngularFireAuth
    ) {
        this.ms.currentMessage.asObservable().subscribe(data =>{
            if(data == null) return;
            if(data.data.sender === this.afa.auth.currentUser.uid) return;

            this.messages.push(data.notification);
        });
    }

    closed(id){
        this.messages.splice(id, 1);
    }

    ngOnInit() {
    }

}
