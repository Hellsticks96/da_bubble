import { Injectable } from '@angular/core';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { FirestoreService } from './firestore.service';
import { UsersList } from './interfaces/users-list';

@Injectable({
  providedIn: 'root'
})
export class CurrentuserService {
  currentUserUid: string | null = '';
  isLoggedIn: boolean = false;
  currentUser: UsersList = {
    id: '',
    name: '',
    email: '',
    avatar: '',
    online: false
  };

  constructor(private firestore: FirestoreService) {
    this.firestore.currentUser$.subscribe(uid => {
      this.currentUserUid = uid;
      this.subCurrentUser();
    });
  }

  subCurrentUser(): void {
    let firestore = this.firestore.getFirestore();
    if (this.currentUserUid) {
      this.isLoggedIn = true;
      let ref = doc(firestore, 'users', this.currentUserUid);
      onSnapshot(ref, (doc) => {
        this.currentUser = this.setCurrentUserObj(doc.data(), doc.id);
        console.log(this.currentUser);
      });
    } else {
      this.isLoggedIn = false;
      console.log('invalid user uid');
    }
  }

  setCurrentUserObj(obj: any, id: string): UsersList {
    return {
      id: id || '',
      name: obj.name || '',
      email: obj.email || '',
      avatar: obj.avatar || '',
      online: obj.online || false
    };
  }
}
