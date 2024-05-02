import { Component, ElementRef, Input, Output, ViewChild } from '@angular/core';
import { ConversationsComponent } from './conversations/conversations.component';
import { HeaderComponent } from './header/header.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { NgClass } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ThreadComponent } from './thread/thread.component';
import { ChatComponent } from './chat/chat.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';
import { DirectMessageComponent } from './chat/direct-message/direct-message.component';
import { UsersList } from '../../app/interfaces/users-list';
import { NewMessageComponent } from './new-message/new-message.component';

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
    DirectMessageComponent,
    NewMessageComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  threadOpen = false;
  showMenu = false;
  @ViewChild('threadDrawer') public threadDrawer!: MatSidenav;
  OpenComponent: 'directMessage' | 'newMessage' | 'chat' | string = '';
  selectedUser: UsersList = {
    id: '',
    name: '',
    avatar: '',
    email: '',
    online: false
  };

  openThread() {
    this.threadDrawer.open();
  }

  closeThread() {
    this.threadDrawer.close();
  }

  setComponent(componentName: string) {
    this.OpenComponent = componentName;
  }
  selectedUserForDM(user: UsersList) {
    this.selectedUser = user;
    console.log(this.selectedUser);
  }
}
