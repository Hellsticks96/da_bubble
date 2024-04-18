import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './interfaces/user';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { CurrentUser } from './interfaces/current-user';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  public currentUser$: Observable<CurrentUser | null> = this.currentUserSubject.asObservable();

  constructor(private firestore: Firestore) {
    const auth = getAuth();
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Holen Sie Benutzerdaten aus Firestore, wenn der Authentifizierungsstatus sich ändert
        const userDocRef = doc(this.firestore, 'users', firebaseUser.uid);
        onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData: CurrentUser = docSnapshot.data() as CurrentUser;
            this.currentUserSubject.next(userData);
          } else {
            this.currentUserSubject.next(null);
          }
        });
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  getCurrentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }
}
