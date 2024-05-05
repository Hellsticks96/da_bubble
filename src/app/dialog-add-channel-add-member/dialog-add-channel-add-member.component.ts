import { CommonModule } from '@angular/common';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormControlDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatIcon } from '@angular/material/icon';
import { ChatService } from '../main/chat/chat.service';
import { UsersList } from '../interfaces/users-list';
import { FirestoreService } from '../firestore.service';
import { doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { getFirestore } from '@firebase/firestore';
import { Channel } from '../interfaces/channel';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent, MatOption } from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';
import {MatChip, MatChipGrid, MatChipInputEvent, MatChipListbox, MatChipSet, MatChipsModule} from '@angular/material/chips';


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
    MatIcon,
    MatAutocomplete,
    MatOption,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatChipGrid,],
  templateUrl: './dialog-add-channel-add-member.component.html',
  styleUrl: './dialog-add-channel-add-member.component.scss'
})
export class DialogAddChannelAddMemberComponent {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl = new FormControl('');
  filteredMembers: Observable<UsersList[]>;
  addedMembers: UsersList[] = [];
  public allOfficeUsers: UsersList[] = this.chatService.usersList;
  selectedOption: string = '1';

  @ViewChild('nameInput')
  nameInput!: ElementRef<HTMLInputElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: {channelId: string, channelDescription: string},
    public dialogRef: MatDialogRef<DialogAddChannelAddMemberComponent>,
    public dialog: MatDialog,
    public chatService: ChatService
  ) {
    this.filteredMembers = this.userCtrl.valueChanges.pipe(
      startWith(''),
      map((value: string | null) => (value ? this._filter(value) : this.chatService.usersList.slice())),
    );
  }

  dataBase = getFirestore();

  dataBase = getFirestore();


  public async createChannel(){
    let members: UsersList[];

    if (this.selectedOption === '2') {
      members = this.addedMembers;
    } else {
      members = this.chatService.usersList;
    }

    await setDoc(doc(this.dataBase, "channels", this.data.channelId), {
      description: this.data.channelDescription,
      members: members,
    })
    this.dialog.closeAll()
  }

  // public async addAllOfficeMembers(){
  //   this.addedMembers = this.chatService.usersList
  // }

  remove(user: UsersList): void {
    const index = this.addedMembers.indexOf(user);

    if (index >= 0) {
      this.addedMembers.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = (event.option.viewValue || '').trim();
    
        // Add our member
    for (let user of this.chatService.usersList){
      if (user.name === value && this.addedMembers.indexOf(user) === -1) {
      this.addedMembers.push(user);
      }
    }

    this.nameInput.nativeElement.value = '';
    this.userCtrl.setValue(null);
  }

  private _filter(value: string): UsersList[] {
    const filterValue = value.toLowerCase();

    return this.chatService.usersList.filter(user => user.name.toLowerCase().includes(filterValue));
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
