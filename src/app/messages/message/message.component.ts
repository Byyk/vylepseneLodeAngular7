import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input()
  public data: Notification;

  @Input()
  public id: number;

  @Output()
  public closed: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {
      setTimeout(() => {this.closed.emit(this.id); }, 10000);
  }
}

export interface Notification {
  title: string;
  body: string;
}
