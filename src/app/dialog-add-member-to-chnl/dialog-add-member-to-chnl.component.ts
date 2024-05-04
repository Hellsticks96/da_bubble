import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent, MatOption } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { map, startWith } from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { ChatService } from '../main/chat/chat.service';
import { UsersList } from '../interfaces/users-list';
import { MatChipGrid,MatChipInputEvent,MatChipsModule} from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { DialogChannelInfoComponent } from '../dialog-channel-info/dialog-channel-info.component';
import { User } from '../interfaces/user';
interface Message {
  avatar: string;
  name: string;
  time: string;
  message: string;
  reactions: object;
}

@Component({
  selector: 'app-dialog-add-member-to-chnl',
  standalone: true,
  imports: [
    MatDialogContent,
    MatButtonModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatDialogActions,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatChipGrid,
    MatChipsModule,
    MatOption,
    MatIcon,
    MatAutocomplete
  ],
  templateUrl: './dialog-add-member-to-chnl.component.html',
  styleUrls: ['./dialog-add-member-to-chnl.component.scss'], // Achtung: 'styleUrl' zu 'styleUrls' geändert und als Array definiert
})
export class DialogAddMemberToChnlComponent {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl = new FormControl('');
  filteredMembers: Observable<UsersList[]>;
  // fruits: string[] = ['Lemon'];
  addedMembers: UsersList[] = [];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('nameInput')
  nameInput!: ElementRef<HTMLInputElement>;

  // announcer = inject(LiveAnnouncer);

  constructor(
    public dialogRef: MatDialogRef<DialogChannelInfoComponent>,
    public chatService: ChatService
  ) {
    this.filteredMembers = this.userCtrl.valueChanges.pipe(
      startWith(''),
      map((value: string | null) => (value ? this._filter(value) : this.chatService.currentChannel.members.slice())),
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    console.log(value)
    
        // Add our member
    for (let user of this.chatService.currentChannel.members){
      if (user.name === value && this.addedMembers.indexOf(user) === -1) {
      this.addedMembers.push(user);
      }
    }

    // Clear the input value
    event.chipInput!.clear();

    this.userCtrl.setValue(null);
  }

  remove(user: UsersList): void {
    const index = this.addedMembers.indexOf(user);

    if (index >= 0) {
      this.addedMembers.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = (event.option.viewValue || '').trim();
    
        // Add our member
    for (let user of this.chatService.currentChannel.members){
      if (user.name === value && this.addedMembers.indexOf(user) === -1) {
      this.addedMembers.push(user);
      }
    }

    this.nameInput.nativeElement.value = '';
    this.userCtrl.setValue(null);
  }

  private _filter(value: string): UsersList[] {
    const filterValue = value.toLowerCase();

    return this.chatService.currentChannel.members.filter(user => user.name.toLowerCase().includes(filterValue));
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

  //   getAvatarPath(avatarNumber: string): string {
  //   return `./../../assets/img/avatar/${avatarNumber}.svg`;
  // }


  // nameControl = new FormControl();
  // 
  // filteredOptions!: Observable<UsersList[]>; // Typ zu Message[] geändert
  // removable = true;
  // separatorKeysCodes: number[] = [ENTER, COMMA];
  // messages: Message[] = [
  //   {
  //     avatar: '4',
  //     name: 'Noah Braun',
  //     time: '14:25 Uhr',
  //     message: 'Welche Version ist aktuell von Angular?',
  //     reactions: {},
  //   },
  //   {
  //     avatar: '5',
  //     name: 'Sofia Müller',
  //     time: '14:30 Uhr',
  //     message: 'Ich habe die gleiche Frage. Ich habe gegoogelt und es scheint, dass die aktuelle Version Angular 13 ist. Vielleicht weiß Frederik, ob es wahr ist.',
  //     reactions: {
  //       nerd: 1,
  //     },
  //   },
  //   {
  //     avatar: '6',
  //     name: 'Frederik Beck',
  //     time: '15:06 Uhr',
  //     message: 'Ja das ist es.',
  //     reactions: {
  //       'hands-up': 1,
  //       nerd: 3,
  //     },
  //   },
  // ];

  // constructor(public dialogRef: MatDialogRef<DialogAddMemberToChnlComponent>,
  //   public dialog: MatDialog,
  //   public chatService: ChatService) {
    
  // }

  // ngOnInit() {
  //   this.filteredOptions = this.nameControl.valueChanges.pipe(
  //     startWith(''),
  //     map(value => this._filter(value))
  //   );
  // }

  // private _filter(value: string): UsersList[] {
  //   const filterValue = value.toLowerCase();
  //   return this.chatService.usersList.filter(option => option.name.toLowerCase().includes(filterValue));
  // }




  // public addSingleUser(userName: string){
  //   for (const user of this.chatService.usersList){
  //     if (user.name === userName && this.addedMembers.indexOf(user) === -1) this.addedMembers.push(user)
  //   }
  // }
  // public removeUser(user: UsersList){
  //   const userIndex = this.addedMembers.indexOf(user);
  //   if (userIndex === -1) throw new Error(`No user with id ${user.id} found`)
  //   this.addedMembers.splice(userIndex, 1)
  // }
