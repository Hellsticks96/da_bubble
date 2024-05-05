import { Component, EventEmitter, Output } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DialogAddChannelComponent } from '../../dialog-add-channel/dialog-add-channel.component';
import { FirestoreService } from '../../firestore.service';
import { DocumentData, collection, doc, onSnapshot } from '@angular/fire/firestore';
import { ChannelsList } from '../../interfaces/channels-list';
import { UsersList } from '../../interfaces/users-list';
import { ChatService } from '../chat/chat.service';
import { DirectmessageService } from '../chat/direct-message/directmessage.service';
import { CurrentuserService } from '../../currentuser.service';

@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatButtonToggleModule,
    CommonModule,
    MatDialogModule,
    DialogAddChannelComponent,
    MatButtonModule
  ],
  templateUrl: './conversations.component.html',
  styleUrl: './conversations.component.scss',
})
export class ConversationsComponent {
  @Output() openDM = new EventEmitter<string>();
  @Output() user = new EventEmitter<UsersList>();

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


  constructor(
    public dialog: MatDialog,
    public firestore: FirestoreService,
    public chatService: ChatService,
    public DMservice: DirectmessageService,
    private currentUser: CurrentuserService,
  ) {
    this.subChannelsList();

  }

  subChannelsList() {
    let ref = this.firestore.channelsRef;
    return onSnapshot(ref, (list) => {
      this.channelsList = [];
      list.forEach(element => {
        this.channelsList.push(this.setChannelsListObj(element.data(), element.id));
      });
    });
  }

  setChannelsListObj(obj: any, id: string): ChannelsList {
    return {
      id: id || '',
      channelData: obj.channelData || null,
    };
  }

  openDialog() {
    console.log(this.firestore.currentUser$)
    this.dialog.open(DialogAddChannelComponent, {
      panelClass: 'custom-dialog'
    });
  }
  openComponent(componentName: string,) {
    this.openDM.emit(componentName);

  }

  openDirectMessage(user: UsersList) {
    this.user.emit(user);
  }
}

