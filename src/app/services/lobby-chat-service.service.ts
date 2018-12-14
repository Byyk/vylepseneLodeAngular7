import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { Message } from "../match-making/lobby/tabs/chat/chat.component";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class LobbyChatServiceService {

  private _lobbyChatMessage = new BehaviorSubject<Message>(null);
  public lobbyChatMessage: Observable<Message>;

  constructor(
      public afs: AngularFirestore,
      public http: HttpClient
  ) {
    this.lobbyChatMessage = this._lobbyChatMessage.asObservable();
  }

  sendMessage(message: string){
    this.http.post(`${environment.urlBase}/messaging/sendMessage`, {
      
    });
  }

}
