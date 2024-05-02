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
import { collection, addDoc } from "firebase/firestore"; 
import { FirestoreService } from '../firestore.service';
import { doc, setDoc } from '@angular/fire/firestore';

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
    public dialog: MatDialog,
    private firestore: FirestoreService
  ) {}
  dataBase = this.firestore.getFirestore();
  channelName: string = '';
  channelDescription: string = '';
  invalidName = false;

  closeDialog(): void {
    this.dialogRef.close();
  }

  async createChannel(): Promise<void> {
    if (this.channelName && this.channelDescription) {
      await setDoc(doc(this.dataBase, "channels", this.channelName), {
        description: this.channelDescription,
        members: [],
      })
      this.dialogRef.close();
      
      // Öffnen Sie das neue Dialogfeld
      this.dialog.open(DialogAddChannelAddMemberComponent, {
        data : {
          channelId: this.channelName
        }
      });
    } else {
      // Optional: Benutzer darüber informieren, dass beide Felder ausgefüllt sein müssen
      console.log("Bitte füllen Sie beide Felder aus");
    }
  }
}