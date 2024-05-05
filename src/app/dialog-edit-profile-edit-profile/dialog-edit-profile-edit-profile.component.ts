import { Dialog, DialogModule, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FirestoreService } from '../firestore.service';
import { UsersList } from '../interfaces/users-list';
import { User } from '../interfaces/user';
import { HeaderComponent } from '../main/header/header.component';  
import { DocumentData, doc, onSnapshot } from '@angular/fire/firestore';


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
    HeaderComponent,

  ],
  templateUrl: './dialog-edit-profile-edit-profile.component.html',
  styleUrl: './dialog-edit-profile-edit-profile.component.scss'
})
export class DialogEditProfileEditProfileComponent{
  
  currentUserUid: string | null = '';
  currentUser: UsersList = {
    id: '',
    name: '',
    email: '',
    avatar: '',
    online: false
  };
  name = '';
  email = '';
  editing = false;

  constructor(
    public dialogRef: MatDialogRef<DialogEditProfileEditProfileComponent>,
    public dialog: MatDialog,
    private firestore: FirestoreService) {
      this.firestore.currentUser$.subscribe(uid => {
        this.currentUserUid = uid;
        this.subCurrentUser();
        // Führen Sie hier Aktionen aus, die vom aktuellen Benutzerstatus abhängen
      });
    }

    editProfile() {
      this.name = this.currentUser.name;
      this.email = this.currentUser.email;
      this.editing = true;
    }

    cancel() {
      this.editing = false;
      this.name = this.currentUser.name;
      this.email = this.currentUser.email;
    }

    save() {
      this.firestore.updateEmail(this.email)
        .then(() => {
          return this.firestore.updateUser(this.name, this.email, this.currentUser.avatar);
        })
        .then(() => {
          console.log('User updated successfully');
          this.editing = false;
        })
        .catch(error => {
          console.error('Error updating email or user data:', error);
        });
    }
    

    closeDialog() {
      this.dialogRef.close();
    }

    subCurrentUser() {
      let firestore = this.firestore.getFirestore();
      let ref;
      if (this.currentUserUid) {
        ref = doc(firestore, 'users', this.currentUserUid);
        return onSnapshot(ref, (doc) => {
          this.currentUser = this.setCurrentUserObj(doc.data(), doc.id);
        });
      } else {
        return console.log('invalid user uid');
      }
    }
  
    setCurrentUserObj(obj: any, id: string): UsersList {
      return {
        id: id || '',
        name: obj.name || '',
        avatar: obj.avatar || '',
        email: obj.email || '',
        online: obj.online || false
      }
    }

  }