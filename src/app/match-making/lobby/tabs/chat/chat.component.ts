import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
    @ViewChild('chat')
    private scrollContainer: ElementRef;

    constructor() { }

    ngOnInit() {
        try {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
        } catch (e) { console.log(e); }
    }

}
