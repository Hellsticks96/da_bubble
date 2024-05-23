import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { onSnapshot } from '@angular/fire/firestore';
import { ChannelsList } from './interfaces/channels-list';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  channelsList: ChannelsList[] = [];

  constructor(public firestore: FirestoreService,) {
    this.subChannelsList();
    
   }

  subChannelsList() {
    let ref = this.firestore.channelsRef;
    return onSnapshot(ref, (list) => {
      this.channelsList = [];
      list.forEach(element => {
        this.channelsList.push(this.setChannelsListObj(element.data(), element.id));
      });
      console.log(this.channelsList)
    });
  }

  setChannelsListObj(obj: any, id: string): ChannelsList {
    return {
      id: id || '',
      channelData: obj || null,
    };
  }
}
