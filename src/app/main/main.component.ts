import { Component } from '@angular/core';
import { StartComponent } from '../start/start.component';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from './header/header.component';
import { ChatComponent } from './chat/chat.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    StartComponent,
    FormsModule,
    HeaderComponent,
    ChatComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
