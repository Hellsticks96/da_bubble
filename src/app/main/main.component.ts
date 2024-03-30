import { Component } from '@angular/core';
import { ConversationsComponent } from './conversations/conversations.component';
import { HeaderComponent } from './header/header.component';
import { ChatComponent } from './chat/chat.component';
import { ThreadComponent } from './thread/thread.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    HeaderComponent,
    ConversationsComponent,
    ChatComponent,
    ThreadComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
