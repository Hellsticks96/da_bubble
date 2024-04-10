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
import { DialogEditProfileEditProfileComponent } from '../dialog-edit-profile-edit-profile/dialog-edit-profile-edit-profile.component';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-dialog-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    
  ],
  templateUrl: './dialog-edit-profile.component.html',
  styleUrl: './dialog-edit-profile.component.scss'
})
export class DialogEditProfileComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogEditProfileComponent>,
    public dialog: MatDialog,
    public firestore: FirestoreService
  ) {}

  logout() {
    this.dialogRef.close();
    this.firestore.logout();
  }

  openDialog(event: MouseEvent): void {
    // Sicherstellen, dass event.target tatsächlich ein Element ist.
    let element = event.target as Element | null;
    this.dialogRef.close();
    if (element) {
      // Casten zu HTMLElement, um Zugriff auf getBoundingClientRect zu gewährleisten.
      let htmlElement = element as HTMLElement;
      let boundingClientRect = htmlElement.getBoundingClientRect();
      
      // Berechnung der Position, um den Dialog unterhalb des Pfeils zu positionieren.
      let dialogPosition = {
        top: `${boundingClientRect.bottom + window.scrollY -78}px`, // Plus window.scrollY für absolute Positionierung auf der Seite
        left: `${boundingClientRect.left + window.scrollX -250}px`, // Plus window.scrollX für absolute Positionierung auf der Seite
      };
  
      this.dialog.open(DialogEditProfileEditProfileComponent, {
        width: '450px',
        position: dialogPosition,
      });
    }
  }

}
