import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ChatService } from '../main/chat/chat.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dialog-show-channel-member',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog-show-channel-member.component.html',
  styleUrl: './dialog-show-channel-member.component.scss'
})
export class DialogShowChannelMemberComponent {

  constructor(public dialogRef: MatDialogRef<DialogShowChannelMemberComponent>, public chatService : ChatService) {}

  onNoClick() {
    this.dialogRef.close();
  }

  openDialogAddMembers() {
    this.dialogRef.close();
  }
}
