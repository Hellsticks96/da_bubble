import { Dialog, DialogModule, DialogRef } from '@angular/cdk/dialog';
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
  selector: 'app-dialog-edit-profile-edit-profile',
  standalone: true,
  imports: [    
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
      
  ],
  templateUrl: './dialog-edit-profile-edit-profile.component.html',
  styleUrl: './dialog-edit-profile-edit-profile.component.scss'
})
export class DialogEditProfileEditProfileComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogEditProfileEditProfileComponent>,
    public dialog: MatDialog) {}

  onNoClick() {
    this.dialogRef.close();
  }
}
