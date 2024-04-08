import { Injectable } from '@angular/core';
import { FirestoreService } from '../../firestore.service';
import { doc, onSnapshot } from '@angular/fire/firestore';
import { Channel } from '../../interfaces/channel';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // channels: Record<string, Map<string, JSON> > = {};
  channels: Record<string, Channel> = {};

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
    return onSnapshot(doc(ref, id), (doc) => {
      // this.channels[id].members = []
      console.log(doc)
      // doc.forEach(element => {
      //   console.log(element)
      // })
    })
  }

}
