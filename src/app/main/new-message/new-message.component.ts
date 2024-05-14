import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { DirectmessageService } from '../chat/direct-message/directmessage.service';

@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    FormsModule,
    PickerComponent,
    MatMenuModule,
    CommonModule

  ],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.scss'
})
export class NewMessageComponent {
  messageText: string = '';
  isPickerVisible = false;


  constructor(public DMSerivce: DirectmessageService) {

  }
  togglePicker() {
    this.isPickerVisible = !this.isPickerVisible;
  }
  addEmoji(event: any) {
    console.log(event.emoji);
  }
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
