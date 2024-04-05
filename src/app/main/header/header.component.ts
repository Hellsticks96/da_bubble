import { Component, ElementRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DialogEditProfileComponent } from '../../dialog-edit-profile/dialog-edit-profile.component';
import { FirestoreService } from '../../firestore.service';
import { DocumentData, doc, onSnapshot } from '@angular/fire/firestore';
import { UsersList } from '../../interfaces/users-list';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatDialogModule,
    DialogEditProfileComponent,

  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  currentUserUid: string | null = '';
  currentUser: UsersList = {
    id: '',
    name: '',
    avatar: '',
    online: false
  };


  constructor(public dialog: MatDialog, private firestore: FirestoreService) {
    this.firestore.currentUser$.subscribe(uid => {
      this.currentUserUid = uid;
      this.subCurrentUser();
      // Führen Sie hier Aktionen aus, die vom aktuellen Benutzerstatus abhängen
    });
  }

  openDialog(event: MouseEvent): void {
    // Sicherstellen, dass event.target tatsächlich ein Element ist.
    let element = event.target as Element | null;

    if (element) {
      // Casten zu HTMLElement, um Zugriff auf getBoundingClientRect zu gewährleisten.
      let htmlElement = element as HTMLElement;
      let boundingClientRect = htmlElement.getBoundingClientRect();

      // Berechnung der Position, um den Dialog unterhalb des Pfeils zu positionieren.
      let dialogPosition = {
        top: `${boundingClientRect.bottom + window.scrollY + 15}px`, // Plus window.scrollY für absolute Positionierung auf der Seite
        left: `${boundingClientRect.left + window.scrollX - 200}px`, // Plus window.scrollX für absolute Positionierung auf der Seite
      };

      this.dialog.open(DialogEditProfileComponent, {
        width: '250px',
        position: dialogPosition,
      });
    }
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
      online: obj.online || false
    }
  }
}
