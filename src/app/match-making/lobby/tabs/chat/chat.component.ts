import {Component, ElementRef, OnInit, ViewChild, AfterViewChecked} from '@angular/core';
import {faComment} from '@fortawesome/free-solid-svg-icons';
import {MatchChatService} from '../../../../services/match-chat.service';
import {map} from 'rxjs/operators';
import {LoginService} from '../../../../services/login.service';
import {MessageModel} from '../../../../model/message.model';

export interface Message {
    uid: string;
    own: boolean;
    message: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked{
    faComment = faComment;
    @ViewChild('chat')
    private scrollContainer: ElementRef;
    public messages: Message[] = [];

    public messageTextBox: string;

    constructor(
        public mcs: MatchChatService,
        public ls: LoginService
    ) { }

    ngOnInit() {
        this.mcs.init();

        this.mcs.messages.pipe(this.mapFromMessageModelToMessage).subscribe(messages => {
            if(messages == null) return;
            this.messages = messages.concat(this.messages);
            console.log(messages);
        });

        this.mcs.newMessage.pipe(map(data => {
            return {
                message: data.message,
                own: this.ls.userData.uid === data.senderUid,
                uid: data.uid
            };
        })).subscribe(mes => {
            if(mes == null) return;
            if(this.messages.length !== 0){
                if(this.messages[this.messages.length - 1].uid !== mes.uid)
                    this.messages.push(mes);
            } else this.messages.push(mes);
        });
    }

    ngAfterViewChecked(): void {
        try {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
        } catch (e) { console.error(e); }
    }

    init(){

    }

    mapFromMessageModelToMessage = map((data : MessageModel[]) => {
        if(data === null) return;
        const pole: Message[] = [];
        data.forEach(mess => {
            pole.push({message: mess.message, own: this.ls.userData.uid === mess.senderUid, uid: mess.uid});
        });
        return pole;
    });

    enterSendMessage(event){
        if(event.key === "Enter"){
            this.sendMessage();
        }
    }

    sendMessage(){
        
    }
}
