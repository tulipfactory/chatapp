import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import firebase from 'firebase/app';
import 'firebase/database';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-addroom',
  templateUrl: './addroom.component.html',
  styleUrls: ['./addroom.component.css']
})
export class AddroomComponent implements OnInit {
 
 roomForm: FormGroup;
 nickname= '';
 roomname= '';
 ref = firebase.database().ref('rooms/');
 matcher = new MyErrorStateMatcher();
 
  constructor(private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private snackBar: MatSnackBar) { }


onFormSubmit(form: any) {
  const room = form;
  this.ref.orderByChild('roomname').equalTo(room.roomname).once('value', (snapshot:any) =>
  { if (snapshot.exists()) {
    this.snackBar.open('Room name already exists!');
  } else {
    const newRoom = firebase.database().ref('rooms/').push();
    newRoom.set(room);
    this.router.navigate(['/roomlist', this.nickname]);
  } //this function submits the form.
  })
}






  
  ngOnInit(): void {
    this.roomForm = this.formBuilder.group({
      'roomname': [null, Validators.required]
    });
  }
//initialize the formBuilder
}
