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

@Component({
  selector: 'app-dialog-add-member-to-chnl',
  standalone: true,
  imports: [
    MatDialogContent,
    MatButtonModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatDialogActions
  ],
  templateUrl: './dialog-add-member-to-chnl.component.html',
  styleUrl: './dialog-add-member-to-chnl.component.scss',
})
export class DialogAddMemberToChnlComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogAddMemberToChnlComponent>,
    public dialog: MatDialog
  ) {}

  onNoClick() {
    this.dialogRef.close();
  }
}
