import {Component, ElementRef, OnInit, ViewChild, AfterViewChecked, Input} from '@angular/core';
import {faComment} from '@fortawesome/free-solid-svg-icons';
import {MatchChatService} from '../../../../services/match-chat.service';
import {map, skip} from 'rxjs/operators';
import {LoginService} from '../../../../services/login.service';
import {MessageModel} from '../../../../model/message.model';
import {interval, Observable} from "rxjs";

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

    @Input()
    set ready(isReady: boolean){
        if (isReady) this.pageLoaded();
    }

    pageLoaded(){
        try {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
        } catch (e) { console.error(e); }
    }

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
            if(data == null) return;
            return {
                message: data.message,
                own: this.ls.userData.uid === data.senderUid,
                uid: data.uid
            };
        }), skip(1)).subscribe(mes => {
            if(mes == null) return;
                this.messages.push(mes);
            }
        );

        setInterval(() => {
            if(this.scrollContainer.nativeElement.scrollTop < 30) {
                
            }}, 500);
    }

    ngAfterViewChecked(): void {

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
        this.mcs.sendMessage(this.messageTextBox)
            .then(() => {

            })
            .catch(() => {
                alert('odeslání správy se nezdařilo!');
            });
        this.messageTextBox = "";
    }

    onChatScroll(event){
        console.log(event);
    }
}
