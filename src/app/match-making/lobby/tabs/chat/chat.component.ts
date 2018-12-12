import { Component, OnInit } from '@angular/core';
import {faComment} from '@fortawesome/free-solid-svg-icons';

export interface Message {
    own: boolean;

}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    faComment = faComment;


    constructor() { }

    ngOnInit() {
    }

}
