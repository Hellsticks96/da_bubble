import { CommonModule } from '@angular/common';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
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
import { doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { getFirestore } from '@firebase/firestore';
import { Channel } from '../interfaces/channel';
import { MatAutocomplete, MatAutocompleteModule, MatOption } from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';
import {MatChip, MatChipGrid, MatChipListbox, MatChipSet, MatChipsModule} from '@angular/material/chips';


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
export class DialogAddChannelAddMemberComponent implements OnInit {
  public addedMembers: UsersList[] = [];
  public allOfficeUsers: UsersList[] = this.chatService.usersList;
  nameControl = new FormControl();
  filteredOptions!: Observable<UsersList[]>;
  selectedOption: string = '';
  separatorKeysCodes: number[] = [ENTER, COMMA];
  name: string = '';
  multiple = true;
  removable = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: {channelId: string},
    public dialogRef: MatDialogRef<DialogAddChannelAddMemberComponent>,
    public dialog: MatDialog,
    public chatService: ChatService,
    private firestore: FirestoreService
  ) {}

  ngOnInit() {
    this.filteredOptions = this.nameControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  dataBase = getFirestore();


  closeDialog(): void {
    this.dialogRef.close();
  }

  public async addAllOfficeMembers(){
    this.addedMembers = this.chatService.usersList
  }

  public addSingleUser(userName: string){
    for (const user of this.chatService.usersList){
      if (user.name === userName && this.addedMembers.indexOf(user) === -1) this.addedMembers.push(user)
    }
  }

  public removeUser(user: UsersList){
    const userIndex = this.addedMembers.indexOf(user);
    if (userIndex === -1) throw new Error(`No user with id ${user.id} found`)
    this.addedMembers.splice(userIndex, 1)
  }

  public async addSelectedUsers(){
    await updateDoc(doc(this.dataBase, "channels", `${this.data.channelId}`),{
      members: this.addedMembers
    })
    this.dialog.closeAll()
  }

  private _filter(value: string): UsersList[] {
    const filterValue = value.toLowerCase();
    return this.chatService.usersList.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  getAvatarPath(avatarNumber: string): string {
    return `./../../assets/img/avatar/${avatarNumber}.svg`;
  }
}
