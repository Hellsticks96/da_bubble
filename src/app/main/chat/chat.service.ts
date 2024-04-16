import { Injectable } from '@angular/core';
import { FirestoreService } from '../../firestore.service';
import { doc, onSnapshot, setDoc, updateDoc } from '@angular/fire/firestore';
import { Channel } from '../../interfaces/channel';
import { Message } from '../../interfaces/message';
import { update } from '@angular/fire/database';

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

  constructor(private firestore: FirestoreService) {

  }

  openChannel(id: string) {
    let ref = this.firestore.channelsRef;
    return onSnapshot(doc(ref, id), (docSnap) => {
      if (docSnap.exists()) {

        if (!this.channels[id]) {
          this.channels[id] = {
            members: [],
            messages: new Map()
          };
        }

        docSnap.data()['members'].forEach((member: string) => {
          this.channels[id].members.push(member);
        });

        Object.keys(docSnap.data()['messages']).forEach(key => {
          const message = docSnap.data()['messages'][key];
          this.channels[id].messages?.set(key, message);
        });
      }

      this.currentChannel = this.channels[id];
      this.currentChannelID = id;
    });
  }

  async sendMessage(channelId: string, message: Message) {
    const channelRef = doc(this.firestore.firestore, `channels/${channelId}`);
    const messageKey = `messages.${message.time}`; // Verwenden Sie Zeit als eindeutigen Schlüssel

    // Konvertieren Sie die Map der Reaktionen in ein Objekt
    const messageData = {
      avatar: message.avatar,
      name: message.name,
      time: message.time,
      message: message.message,
      reactions: message.reactions ? this.mapToObject(message.reactions) : {}
    };

    // Setzen Sie das Nachrichtenobjekt in die Map ein
    await setDoc(channelRef, {
      [messageKey]: messageData
    }, { merge: true }); // 'merge: true' sorgt dafür, dass vorhandene Daten nicht überschrieben werden
  }

 mapToObject(map: Map<string, number>): { [key: string]: number } {
  const obj: { [key: string]: number } = {};
  map.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}}