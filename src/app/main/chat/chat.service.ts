import { Injectable } from '@angular/core';
import { FirestoreService } from '../../firestore.service';
import { collection, doc, onSnapshot, orderBy, query, setDoc, where, serverTimestamp } from '@angular/fire/firestore';
import { Channel } from '../../interfaces/channel';
import { Message } from '../../interfaces/message';
import { update } from '@angular/fire/database';
import { v4 as uuidv4 } from 'uuid';
import { CurrentuserService } from '../../currentuser.service';
import { UsersList } from '../../interfaces/users-list';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // channels: Record<string, Map<string, JSON> > = {};
  channels: Record<string, Channel> = {};
  currentChannel: Channel = {
    members: []
  };
  currentChannelID = '';
  usersList: UsersList[] = [];
  
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

  constructor(private firestore: FirestoreService, public currentUser : CurrentuserService) {
    this.subUsersList();

  }

  // openChannel(id: string) {
  //   let ref = this.firestore.channelsRef;

  //   return onSnapshot(doc(ref, id), (docSnap) => {
  //     if (docSnap.exists()) {

  //       if (!this.channels[id]) {
  //         this.channels[id] = {
  //           members: [],
  //           messages: new Map()
  //         };
  //       }
  //       docSnap.data()['members'].forEach((member: string) => {
  //         if (!this.channels[id].members.includes(member)) { // Verhindert Duplikate
  //           this.channels[id].members.push(member);
  //         }
  //       });

  //       Object.keys(docSnap.data()['messages']).forEach(key => {
  //         const message = docSnap.data()['messages'][key];
  //         this.channels[id].messages?.set(key, message);
  //       });
  //     }

  //     this.currentChannel = this.channels[id];
  //     this.currentChannelID = id;
  //   });
  // }

  openChannel(id: string) {
    const channelRef = this.firestore.channelsRef;
    const channelDocRef = doc(channelRef, id);
    const messagesCollectionRef = collection(channelDocRef, 'messages');

    // Erstellen einer Abfrage mit Sortierung
    const messagesQuery = query(messagesCollectionRef, orderBy("time") // Sortiert die Nachrichten absteigend nach Zeit
    );

    return onSnapshot(messagesQuery, (querySnapshot) => {
      if (!this.channels[id]) {
        this.channels[id] = {
          members: [],
          messages: new Map()
        };
      }

      querySnapshot.forEach((doc) => {
        const messageData = doc.data() as Message;
        this.channels[id].messages?.set(doc.id, messageData); // Speichert jede Nachricht in der Map
      });

      onSnapshot(doc(channelRef, id), (docSnap) => {
        if (docSnap.exists() && docSnap.data()['members']) {
          this.channels[id].members = docSnap.data()['members'];
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
    console.log(messageData)
    await setDoc(newMessageRef, messageData);
  }

  subUsersList() {
    let ref = this.firestore.usersRef;
    return onSnapshot(ref, (list) => {
      this.usersList = [];
      list.forEach(element => {
        if (element.id !== this.currentUser.currentUserUid) {
          this.usersList.push(this.setUsersListObj(element.data(), element.id))
        }
      })
    })
  }

  setUsersListObj(obj: any, id: string): UsersList {
    return {
      id: id || '',
      name: obj.name || '',
      avatar: obj.avatar || '',
      email: obj.email || '',
      online: obj.online || false
    }
  }
}