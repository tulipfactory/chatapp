import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import firebase from 'firebase';
import 'firebase/database';
import { DatePipe, formatCurrency } from '@angular/common';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


export const snapshotToArray = (snapshot: any) => {
  const returnArr = [];

  snapshot.forEach((childSnapshot: any) => {
    const item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });
// this constant function will extract/convert the Firebase response to the array of objects

return returnArr;
};

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {

@ViewChild('chatcontent') chatcontent: ElementRef;
scrolltop: number = null;
//these variables implement an auto scroll to the chat box 

chatForm: FormGroup;
nickname = '';
roomname = '';
message = '';
users= [];
chats = [];
matcher = new MyErrorStateMatcher();
//declare variables
  constructor(private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe) {
      this.nickname = localStorage.getItem('nickname');
      this.roomname = this.route.snapshot.params.roomname;
      firebase.database().ref('chats/').on('value', resp => {
        //format the dates of messages sent
        this.chats = [];
        let tempChats = snapshotToArray(resp)
        tempChats.forEach(chat=>{
          if(!Date.parse(chat.date)){
            let tempDate = chat.date;
            tempDate = tempDate.replace(" ", "T");
            tempDate = tempDate.replace(/\//g, "-");
            tempDate += "Z";
            chat.date = this.datepipe.transform(Date.parse(tempDate), 'dd/MM/yyyy HH:mm:ss');
          }
        });
        //set the chat messages in the room
        this.chats = tempChats;
        setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 500);
      });
      firebase.database().ref('roomusers/').orderByChild('roomname').equalTo(this.roomname).on('value', (resp2: any) => {
        const roomusers = snapshotToArray(resp2);
        this.users = roomusers.filter(x => x.status === 'online');
      });
    }

  ngOnInit(): void {
    this.chatForm = this.formBuilder.group({
      'message': [null, Validators.required]
    }); //intialize the form group for the message-form
  }


  onFormSubmit(form: any) {
    const chat = form;
    chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.type = 'message';
    const newMessage = firebase.database().ref('chats/').push();
    newMessage.set(chat);
    this.chatForm = this.formBuilder.group({
      'message' : [null, Validators.required]
    })
  }//this function will submit the message form and save it to the firebase realtime-database document

  exitChat() {
    const chat = { roomname: '', nickname: '', message: '', date: '', type: ''};
    chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.message = '${this.nickname} leave the room';
    chat.type = 'exit';
    const newMessage = firebase.database().ref('chats/').push();
    newMessage.set(chat);

    firebase.database().ref('roomusers/').orderByChild('roomname').equalTo(this.roomname).on('value', (resp:any) => {
      let roomuser = [];
      roomuser = snapshotToArray(resp);
      const user = roomuser.find(x => x.nickname === this.nickname);
      if (user !== undefined) {
        const userRef = firebase.database().ref('roomusers/' + user.key);
        userRef.update({status: 'offline'});
      }
    });//this function is used to exit the chat room. it will send the exit message to the 
    //firebase realtime database, set the room user status, and go back to the room lis
    this.router.navigate(['/roomlist', this.nickname]);

  
  }
}
