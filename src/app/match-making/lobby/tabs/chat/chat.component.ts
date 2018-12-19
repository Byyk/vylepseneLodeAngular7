import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit, QueryList,
    ViewChild, ViewChildren
} from '@angular/core';
import {faComment} from '@fortawesome/free-solid-svg-icons';
import {MatchChatService} from '../../../../services/match-chat.service';
import {map, skip} from 'rxjs/operators';
import {Subscription, timer} from 'rxjs';
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
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit, AfterViewInit{
    faComment = faComment;

    @ViewChild('chat')
    private scrollContainer: ElementRef;

    @ViewChildren('messa')
    private mess: QueryList<any>;

    public messages: Message[] = [];
    public messageTextBox: string;

    constructor(
        private mcs: MatchChatService,
        private ls: LoginService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.mcs.init();

        this.mcs.messages.pipe(this.mapFromMessageModelToMessage).subscribe(messages => {
            if(messages == null) return;
            this.messages = messages.concat(this.messages);
            this.cdr.markForCheck();
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
                this.cdr.markForCheck();
            });

        const ref = timer(1000, 500).subscribe(() => {
            if(this.scrollContainer.nativeElement.scrollTop < 30){
                this.mcs.loadNext();
            }
        });
        this.mcs.end.subscribe((val) => { if(val) ref.unsubscribe(); });
    }

    ngAfterViewInit(): void {
        this.mess.changes.subscribe(t => {
            this.handleForEnd();
        });
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

    public handleForEnd(){
        try {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight + 1000;
        } catch (e) { console.error(e); }
    }
}
