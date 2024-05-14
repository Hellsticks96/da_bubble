import { EventEmitter, Injectable, Output } from '@angular/core';
import { FirestoreService } from '../../firestore.service';
import { collection, doc, onSnapshot, orderBy, query, setDoc, where, serverTimestamp } from '@angular/fire/firestore';
import { Channel } from '../../interfaces/channel';
import { Message } from '../../interfaces/message';
import { update } from '@angular/fire/database';
import { v4 as uuidv4 } from 'uuid';
import { CurrentuserService } from '../../currentuser.service';
import { UsersList } from '../../interfaces/users-list';
import { ChannelsList } from '../../interfaces/channels-list';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // channels: Record<string, Map<string, JSON> > = {};
  channels: Record<string, Channel> = {};
  currentChannel: Channel = {
    name: '',
    description: "",
    creator: '',
    members: []
  };
  channelsList: ChannelsList[] = [];
  currentChannelID = '';
  usersList: UsersList[] = [];
  openComponent: 'directMessage' | 'newMessage' | 'chat' | string = '';
  selectedChannel = '';
  selectedDirectmessage = '';
  mobileOpen = '';
  selectedUser: UsersList = {
    id: '',
    name: '',
    avatar: '',
    email: '',
    online: false
  };

  // messages = [
  //   {
  //     id: 1,
  //     avatar: '4',
  //     name: 'Noah Braun',
  //     time: '14:25 Uhr',
  //     message: 'Welche Version ist aktuell von Angular?',
  //     reactions: {

  //     }
  //   },
  //   {
  //     id: 2,
  //     avatar: '5',
  //     name: 'Sofia Müller',
  //     time: '14:30 Uhr',
  //     message: 'Ich habe die gleiche Frage. Ich habe gegoogelt und es scheint, dass die aktuelle Version Angular 13 ist. Vielleicht weiß Frederik, ob es wahr ist.',
  //     reactions: {
  //       'nerd': 1
  //     }
  //   },
  //   {
  //     id: 3,
  //     avatar: '6',
  //     name: 'Frederik Beck',
  //     time: '15:06 Uhr',
  //     message: 'Ja das ist es.',
  //     reactions: {
  //       'hands-up': 1,
  //       'nerd': 3,
  //     }
  //   }
  // ];

  constructor(public firestore: FirestoreService, public currentUser: CurrentuserService) {
    this.subUsersList();
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
      channelData: obj || null,
    };
  }

  openChannel(channelId: string) {
    this.selectedChannel = channelId;
    this.selectedDirectmessage = '';
    this.loadChannel(channelId);
    if (window.matchMedia('(max-width: 431px)').matches) {
      this.mobileOpen = 'chat';
    }
  }

  openDirectMessage(user: UsersList) {
    this.selectedDirectmessage = user.id;
    this.selectedChannel = '';
    this.selectedUser = user;
    if (window.matchMedia('(max-width: 431px)').matches) {
      this.mobileOpen = 'directmessage';
    }
  }

  loadChannel(id: string) {
    const channelRef = this.firestore.channelsRef;
    const channelDocRef = doc(channelRef, id);
    const messagesCollectionRef = collection(channelDocRef, 'messages');

    // Erstellen einer Abfrage mit Sortierung
    const messagesQuery = query(messagesCollectionRef, orderBy("time") // Sortiert die Nachrichten absteigend nach Zeit
    );

    return onSnapshot(messagesQuery, (querySnapshot) => {
      if (!this.channels[id]) {
        this.channels[id] = {
          name: '',
          description: "",
          creator: '',
          members: [],
          messages: new Map()
        };
      }

      querySnapshot.forEach((doc) => {
        const messageData = doc.data() as Message;
        this.channels[id].messages?.set(doc.id, messageData); // Speichert jede Nachricht in der Map
      });

      onSnapshot(doc(channelRef, id), (docSnap) => {
        if (docSnap.exists()) {
          this.channels[id].name = docSnap.data()['name'];
          this.channels[id].creator = docSnap.data()['creator'];

          if (docSnap.data()['members']) {
            this.channels[id].members = docSnap.data()['members'];
          }

          if (docSnap.data()['description']) {
            this.channels[id].description = docSnap.data()['description'];
          }
        }
      });

      this.currentChannel = this.channels[id];
      this.currentChannelID = id;
    });
  }

  async sendMessage(channelId: string, message: Message) {
    const channelRef = collection(this.firestore.firestore, `channels/${channelId}/messages`);
    const timestamp = new Date().toISOString();
    const newMessageRef = doc(channelRef, timestamp);

    const messageData: Message = {
      avatar: this.currentUser.currentUser.avatar,// avatar: message.avatar,
      name: this.currentUser.currentUser.name,
      time: message.time,
      message: message.message,
      createdAt: serverTimestamp(),
      reactions: {}
    };
    console.log(messageData);
    await setDoc(newMessageRef, messageData);
  }

  subUsersList() {
    let ref = this.firestore.usersRef;
    return onSnapshot(ref, (list) => {
      this.usersList = [];
      list.forEach(element => {
        this.usersList.push(this.setUsersListObj(element.data(), element.id));
        // if (element.id !== this.currentUser.currentUserUid) {
        //   this.usersList.push(this.setUsersListObj(element.data(), element.id))
        // }
      });
    });
  }

  setUsersListObj(obj: any, id: string): UsersList {
    return {
      id: id || '',
      name: obj.name || '',
      avatar: obj.avatar || '',
      email: obj.email || '',
      online: obj.online || false
    };
  }

  setComponent(componentName: string) {
    this.openComponent = componentName;
  }
}