import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase/app';
import { ChatMessage } from '../models/chat-message.model';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  user: any;
  chatMessages: AngularFireList<ChatMessage>;
  chatMessage: ChatMessage;
  userName: Observable<string>;
  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
  ) { 
   // this.afAuth.authState.subscribe(auth => {
    //  if( auth !== undefined && auth !== null) {
    //    this.user = auth;
    //  }
   // }); //authenticates users
  }
  sendMessage(msg: string) {
    const timestamp = this.getTimeStamp();
    // const email = this.user.email;
    const email = 'text@example.com';
    this.chatMessages = this.getMessages();
    this.chatMessages.push({
      message: msg,
      timeSent: timestamp,
      userName: 'test-user',
      email: email

    })
    console.log('called me!');
   // this.chatMessages.push({
      //message: msg,
     // timeSent: timestamp,
      // userName: this.userName,
      //userName: 'test-user',
      //email: email
    //}); 
  }
  getMessages(): AngularFireList<ChatMessage> {
    return this.db.list('messages', ref => {
      return ref.limitToLast(25).orderByKey();
    });
  }
  getTimeStamp(): Date{
    const now = new Date();
    const date = now.getUTCFullYear() + '/' +
      (now.getUTCMonth() + 1) + '/' +
      now.getUTCDate();
    
    const time = now.getUTCHours() + ':' +
      now.getUTCMinutes() + ':' +
      now.getUTCSeconds();
    return now;
  }
}
