import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChatService } from '../main/chat/chat.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DialogAddMemberToChnlComponent } from '../dialog-add-member-to-chnl/dialog-add-member-to-chnl.component';
@Component({
  selector: 'app-dialog-show-channel-member',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './dialog-show-channel-member.component.html',
  styleUrl: './dialog-show-channel-member.component.scss'
})
export class DialogShowChannelMemberComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogShowChannelMemberComponent>,
    public chatService : ChatService,
    public dialog: MatDialog) {}

  onNoClick() {
    this.dialogRef.close();
  }

  openDialogAddMembers() {
    this.dialogRef.close();
    this.dialog.open(DialogAddMemberToChnlComponent, {
      panelClass: 'custom-dialog-br',
    });
  }
}
