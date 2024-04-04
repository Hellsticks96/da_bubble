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
import { MatRadioModule } from '@angular/material/radio';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-dialog-add-channel-add-member',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    MatRadioModule,
    MatIcon],
  templateUrl: './dialog-add-channel-add-member.component.html',
  styleUrl: './dialog-add-channel-add-member.component.scss'
})
export class DialogAddChannelAddMemberComponent {
  selectedOption: string = '';
  name: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogAddChannelAddMemberComponent>,
    public dialog: MatDialog
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
