import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogAddChannelComponent } from '../../dialog-add-channel/dialog-add-channel.component';
import { FirestoreService } from '../../firestore.service';
import { DocumentData, collection, doc, onSnapshot } from '@angular/fire/firestore';
import { ChannelsList } from '../../interfaces/channels-list';
import { UsersList } from '../../interfaces/users-list';

@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatButtonToggleModule,
    CommonModule,
    MatDialogModule,
    DialogAddChannelComponent,
  ],
  templateUrl: './conversations.component.html',
  styleUrl: './conversations.component.scss',
})
export class ConversationsComponent {
  contacts = [
    {
      avatar: '6',
      name: 'Frederick Beck (Du)',
      online: true,
    },
    {
      avatar: '5',
      name: 'Sofia Müller',
      online: true,
    },
    {
      avatar: '4',
      name: 'Noah Braun',
      online: true,
    },
    {
      avatar: '1',
      name: 'Elise Roth',
      online: false,
    },
    {
      avatar: '2',
      name: 'Elias Neumann',
      online: true,
    },

    {
      avatar: '3',
      name: 'Steffen Hoffmann',
      online: true,
    },
  ];
  channelsList: ChannelsList[] = [];
  usersList: UsersList[] = [];


  constructor(public dialog: MatDialog, private firestore: FirestoreService) {
    this.subChannelsList();
    this.subUsersList();

  }

  subChannelsList() {
    let ref = this.firestore.channelsRef;
    return onSnapshot(ref, (list) => {
      this.channelsList = [];
      list.forEach(element => {
        this.channelsList.push(this.setChannelsListObj(element.data(), element.id))
      })
    })
  }

  subUsersList() {
    let ref = this.firestore.usersRef;
    return onSnapshot(ref, (list) => {
      this.usersList = [];
      list.forEach(element => {
        this.usersList.push(this.setUsersListObj(element.data(), element.id))
      })
    })
  }

  setChannelsListObj(obj: any, id: string): ChannelsList {
    return {
      id: id || '',
      members: obj.members || [''],
    }
  }

  setUsersListObj(obj: any, id: string): UsersList {
    return {
      id: id || '',
      name: obj.name || '',
      avatar: obj.avatar || '',
      online: obj.online || false
    }
  }

  openDialog() {
    this.dialog.open(DialogAddChannelComponent, {
      panelClass: 'custom-dialog'
    });
  }
}
