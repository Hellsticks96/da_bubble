import { Component, Input } from '@angular/core';
import { ChatComponent } from '../chat.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogChannelInfoComponent } from '../../../dialog-channel-info/dialog-channel-info.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ConversationsComponent } from '../../conversations/conversations.component';
import { UsersList } from '../../../interfaces/users-list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { serverTimestamp } from '@angular/fire/firestore';
import { PofileInfoCardComponent } from '../../../pofile-info-card/pofile-info-card.component';
import { DialogAddMemberToChnlComponent } from '../../../dialog-add-member-to-chnl/dialog-add-member-to-chnl.component';
import { FormsModule } from '@angular/forms';
import { Message } from '../../../interfaces/message';
import { DirectmessageService } from './directmessage.service';
import { MatMenuModule } from '@angular/material/menu';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-direct-message',
  standalone: true,
  imports: [ChatComponent, PickerComponent,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatDialogModule,
    ConversationsComponent,
    MatButtonToggleModule,
    FormsModule,
    MatMenuModule,
  ],

  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss'
})
export class DirectMessageComponent {
  isPickerVisible = false;
  messageText: string = '';

  constructor(public dialog: MatDialog, public DMSerivce: DirectmessageService,
    public chatService: ChatService
  ) {

  }
  ngOnInit() {
  }
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  togglePicker() {
    this.isPickerVisible = !this.isPickerVisible;
  }
  addEmoji(event: any) {
    console.log(event.emoji);
  }
  openDialogChannelInfo() {
    this.dialog.open(DialogChannelInfoComponent, {
      panelClass: 'custom-dialog-br',
    });
  }

  openProfileCard() {
    this.dialog.open(PofileInfoCardComponent, {
      data: this.chatService.selectedUser
    });


  }
  async send() {
    if (this.messageText.trim() !== '') {
      const message: Message = {
        avatar: '',
        name: '', // wird im chat.service übernommen 
        time: new Date().toISOString(),
        message: this.messageText,
        createdAt: serverTimestamp(),
        reactions: {}
      };

      await this.DMSerivce.sendMessage(this.chatService.selectedUser.id, message);
      this.messageText = ''; // Textfeld nach dem Senden leeren
    }

  }
}
