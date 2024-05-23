import { Component } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FirestoreService } from '../firestore.service';
import { DialogEditProfileComponent } from '../dialog-edit-profile/dialog-edit-profile.component';
import { DialogEditProfileEditProfileComponent } from '../dialog-edit-profile-edit-profile/dialog-edit-profile-edit-profile.component';

@Component({
  selector: 'app-bottomsheet-profile-menu',
  standalone: true,
  imports: [MatBottomSheetModule],
  templateUrl: './bottomsheet-profile-menu.component.html',
  styleUrl: './bottomsheet-profile-menu.component.scss'
})
export class BottomsheetProfileMenuComponent {
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomsheetProfileMenuComponent>,
    public dialog: MatDialog,
    public firestore: FirestoreService
  ) {}

  logout() {
    this._bottomSheetRef.dismiss();
    this.firestore.logout();
  }

  openProfile(): void {
    this.dialog.open(DialogEditProfileEditProfileComponent, {
    });
  }
}
