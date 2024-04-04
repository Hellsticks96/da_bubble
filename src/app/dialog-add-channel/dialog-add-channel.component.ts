import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { DialogAddChannelAddMemberComponent } from '../dialog-add-channel-add-member/dialog-add-channel-add-member.component';

@Component({
  selector: 'app-dialog-add-channel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
  ],
  templateUrl: './dialog-add-channel.component.html',
  styleUrl: './dialog-add-channel.component.scss',
})
export class DialogAddChannelComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogAddChannelComponent>,
    public dialog: MatDialog
  ) {}
  channelName: string = '';
  channelDescription: string = '';

  onNoClick(): void {
    this.dialogRef.close();
  }

  createChannel(): void {
    if (this.channelName && this.channelDescription) {
      // Schließen Sie zuerst das aktuelle Dialogfeld
      this.dialogRef.close();
      
      // Öffnen Sie das neue Dialogfeld
      this.dialog.open(DialogAddChannelAddMemberComponent, {
      });
    } else {
      // Optional: Benutzer darüber informieren, dass beide Felder ausgefüllt sein müssen
      console.log("Bitte füllen Sie beide Felder aus");
    }
  }
}