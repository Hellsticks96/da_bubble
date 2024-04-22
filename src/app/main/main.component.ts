import { Component, Input, Output } from '@angular/core';
import { ConversationsComponent } from './conversations/conversations.component';
import { HeaderComponent } from './header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgClass } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ThreadComponent } from './thread/thread.component';
import { ChatComponent } from './chat/chat.component';
import { WelcomeScreenComponent } from '../welcome-screen/welcome-screen.component';
import { DirectMessageComponent } from './conversations/direct-message/direct-message.component';
import { UsersList } from '../../app/interfaces/users-list';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    HeaderComponent,
    ConversationsComponent,
    MatSidenavModule,
    ThreadComponent,
    NgClass,
    RouterLink,
    RouterOutlet,
    ChatComponent,
    WelcomeScreenComponent,
    DirectMessageComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  threadOpen = false;
  showMenu = true;
  OpenComponent : 'directMessage' | 'newChannel' | 'chat'  | string = '';
  selectedUser: UsersList = {
    id: '',
    name: '',
    avatar: '',
    email: '',
    online: false
  };
  

  toggleThread(toggle : boolean){
    this.threadOpen = toggle;
  }

  setComponent(componentName : string){
    this.OpenComponent = componentName;
  }
  selectedUserForDM(user : UsersList){
    this.selectedUser = user;
    console.log(this.selectedUser)
  }
}
