import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import firebase from 'firebase/app';
import 'firebase/database';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  nickname = '';
  ref = firebase.database().ref('users/'); //this allows you to access the users list in the firebase database
  matcher = new MyErrorStateMatcher();
  constructor(private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    if (localStorage.getItem('nickname')) { //checks if the browser has the nickname stored (if they have logged in previously)
      let nickname = localStorage.getItem('nickname'); //takes you to the roomlist instead of the login (remembers you)
      this.router.navigate(['/roomlist', nickname]);
    }
    this.loginForm = this.formBuilder.group({
      'nickname' : [null, Validators.required]
    });
  }

  onFormSubmit(form: any) {
    const login = form;
    this.ref.orderByChild('nickname').equalTo(login.nickname).once('value', snapshot => {
      //sorts user names alphabetically > checks if the name you typed is in the database userlist 
      if (snapshot.exists()) { //if will only be true if your name is already inside the database
        localStorage.setItem('nickname', login.nickname);
        this.router.navigate(['/roomlist', login.nickname]);
      } else {
        const newUser = firebase.database().ref('users/').push(); //else is true if it is a new user and they will be 
        //added to the userlist database 
        newUser.set(login);
        localStorage.setItem('nickname', login.nickname); //adds your nickname to the browser storage
        this.router.navigate(['/roomlist', login.nickname]); //takes you to your roomlist
      }
    });
  }

}
