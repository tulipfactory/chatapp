import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/database';
import { DatePipe } from '@angular/common';
 //datepipe converts javascript date to the string

export const snapshotToArray = (snapshot: any) => { //converts firebase data to array
  const returnArr = [];

  snapshot.forEach((childSnapshot: any) => {
    const item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });
  return returnArr;
}; //convert/extract firebase response to the array of objects

@Component({
  selector: 'app-roomlist',
  templateUrl: './roomlist.component.html',
  styleUrls: ['./roomlist.component.css']
})
export class RoomlistComponent implements OnInit {

  nickname = '';
  displayedColumns: string[] = ['roomname'];
  rooms = [];
  isLoadingResults = true;

  //required variables

  enterChatRoom(roomname: string) {
    const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
    chat.roomname = roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.message = `${this.nickname} entered the room`;
    chat.type = 'join';
    const newMessage = firebase.database().ref('chats/').push();
    newMessage.set(chat);

    firebase.database().ref('roomusers/').orderByChild('roomname').equalTo(roomname).on('value', (resp: any) => {
      let roomuser = [];
      roomuser = snapshotToArray(resp);
      const user = roomuser.find(x => x.nickname === this.nickname); 
      //43-46 is trying to find you (user) in the right room when you click
     
      if (user !== undefined) { //if   you were already added to the group chat set your status to online
        const userRef = firebase.database().ref('roomusers/' + user.key);
        userRef.update({status: 'online'});
      } else { //if you were not previously in the group chat and had been invited this will just add you in
        const newroomuser = { roomname: '', nickname: '', status: '' };
        newroomuser.roomname = roomname;
        newroomuser.nickname = this.nickname;
        newroomuser.status = 'online';
        const newRoomUser = firebase.database().ref('roomusers/').push();
        newRoomUser.set(newroomuser);
      }
    });
// function to enter the chat room when the user chooses the room from the template 

    this.router.navigate(['/chatroom', this.nickname, roomname]);
  }
  logout(): void {
    localStorage.removeItem('nickname');
    this.router.navigate(['/login']);
  }
  //this function will save a chat message that showed the user enters the chat room and add new users
  //to the "roomusers" document in the Firebase database. Next add a function to logout by removing
  //the nickname from the local storage and redirect back to the login page

  constructor(private route: ActivatedRoute, private router: Router, public datepipe: DatePipe) {
    this.nickname = localStorage.getItem('nickname');
    firebase.database().ref('rooms/').on('value', resp => {
      this.rooms = [];
      this.rooms = snapshotToArray(resp);
      this.isLoadingResults = false;
    }
    ); // modules imported into constructor. 
   }
  

  ngOnInit(): void {
  }

}
