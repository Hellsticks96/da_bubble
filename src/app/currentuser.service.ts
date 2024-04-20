import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './interfaces/user';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { FirestoreService } from './firestore.service';
import { UsersList } from './interfaces/users-list';

@Injectable({
  providedIn: 'root'
})

export class CurrentuserService {
  currentUserUid: string | null = '';
  currentUser: UsersList = {
    id: '',
    name: '',
    email: '',
    avatar: '',
    online: false
  }
  constructor(private firestore : FirestoreService){
    this.firestore.currentUser$.subscribe(uid => {
      this.currentUserUid = uid;
      this.subCurrentUser();
      // Führen Sie hier Aktionen aus, die vom aktuellen Benutzerstatus abhängen
    });
  }
  subCurrentUser() {
    let firestore = this.firestore.getFirestore();
    let ref;
    if (this.currentUserUid) {
      ref = doc(firestore, 'users', this.currentUserUid);
      return onSnapshot(ref, (doc) => {
        this.currentUser = this.setCurrentUserObj(doc.data(), doc.id);
      });
    } else {
      return console.log('invalid user uid');
    }
  }

  setCurrentUserObj(obj: any, id: string): UsersList {
    return {
      id: id || '',
      name: obj.name || '',
      email: obj.email || '',
      avatar: obj.avatar || '',
      online: obj.online || false
    }
  }

}
