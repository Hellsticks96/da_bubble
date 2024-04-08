import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog-show-channel-member',
  standalone: true,
  imports: [],
  templateUrl: './dialog-show-channel-member.component.html',
  styleUrl: './dialog-show-channel-member.component.scss'
})
export class DialogShowChannelMemberComponent {

  constructor(    public dialogRef: MatDialogRef<DialogShowChannelMemberComponent>) {}

  onNoClick() {
    this.dialogRef.close();
  }

  openDialogAddMembers() {
    this.dialogRef.close();
  }
}
