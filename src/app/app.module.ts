import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { UserListComponent } from './chat-form/user-list/user-list.component';
import { ChatFormComponent } from './chat-form/chat-form.component';
import { MessageComponent } from './message/message.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { FormsModule } from '@angular/forms';
import { ChatService } from './services/chat.service';
import { AuthService } from './services/auth.service';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { FeedComponent } from './feed/feed.component';
import { UserItemComponent } from './user-item/user-item.component';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    ChatFormComponent,
    MessageComponent,
    LoginFormComponent,
    SignupFormComponent,
    ChatroomComponent,
    FeedComponent,
    UserItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule, 
    AngularFireModule.initializeApp(environment.firebase),
    RouterModule.forRoot(
      
      [ 
        { path: '', redirectTo: '/loginform', pathMatch: 'full' },
        
        {
        path: "chatform",
        component: ChatFormComponent
      },
      {
        path: "loginform",
        component: LoginFormComponent
      },
      {
       path: "signup",
       component: SignupFormComponent
      },
    
    {
      path: "userlist",
      component: UserListComponent
    },
  {
    path: "message",
    component: MessageComponent
  },
   { path: "chatroom",
    component: ChatroomComponent }]
    )
  ],
  providers: [AuthService, ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
