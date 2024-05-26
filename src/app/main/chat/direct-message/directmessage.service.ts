import { Injectable } from '@angular/core';
import { CurrentuserService } from '../../../currentuser.service';
import { FirestoreService } from '../../../firestore.service';
import { serverTimestamp } from '@angular/fire/database';
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, setDoc } from '@angular/fire/firestore';
import { Message } from '../../../interfaces/message';
import { timestamp } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DirectmessageService {
  sendedUserID! :string;
  messages: Record<string, Message> = {};
  constructor(public currentUser: CurrentuserService, private firestore: FirestoreService) {

  }

  async sendMessage(sendedUserID: string, message: Message) {
    this.sendedUserID = sendedUserID
    const userRef = collection(this.firestore.firestore, `users/${this.currentUser.currentUser.id}/${sendedUserID}/`);
    const messagesSnapshot = await getDocs(userRef);
    const messageCount = messagesSnapshot.size;
    const newMessageRef = doc(userRef, this.padNumber(messageCount, 4));
    
    const newMessage: Message = {
      id: this.currentUser.currentUser.id,
      avatar: this.currentUser.currentUser.avatar,// avatar: message.avatar,
      name: this.currentUser.currentUser.name,
      time: message.time,
      message: message.message,
      createdAt: serverTimestamp(),
      reactions: {}
    };
    try {
      await setDoc(newMessageRef, newMessage,{ merge: true });

    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }

  padNumber(num: number, size: number) {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }

  getMessages(id: string) {
    const channelRef = collection(this.firestore.firestore, `users/${this.currentUser.currentUser.id}/${id}/`);
    const newMessageRef = doc(channelRef);

    const messagesQuery = query(channelRef, orderBy("time"));

    onSnapshot(messagesQuery, (querySnapshot) => {
      this.messages = {};

      querySnapshot.forEach((doc) => {
        const messageData = doc.data() as Message;
        this.messages[doc.id] = messageData;
      });
      
      console.log(this.messages)
      
    });
  }
}