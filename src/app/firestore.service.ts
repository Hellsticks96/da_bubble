import { Injectable, inject } from '@angular/core';
import { list } from '@angular/fire/database';
import { CollectionReference, DocumentData, Firestore, collection, collectionData, doc, onSnapshot, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, confirmPasswordReset } from "firebase/auth";
import { Router } from '@angular/router';
import { getRedirectResult, signInWithRedirect, signOut, updateEmail } from '@angular/fire/auth';
import { User } from './interfaces/user';
import { CurrentuserService } from './currentuser.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  doc(ref: CollectionReference<DocumentData, DocumentData>, id: string): import("@firebase/firestore").DocumentReference<unknown, import("@firebase/firestore").DocumentData> {
    throw new Error('Method not implemented.');
  }
  firestore: Firestore = inject(Firestore);
  auth = getAuth();
  provider = new GoogleAuthProvider();
  currentUser$: Observable<string | null>;
  currentUserID = '';
  usersRef = collection(this.firestore, 'users');
  channelsRef = collection(this.firestore, 'channels');

  constructor(private router: Router) {
    this.currentUser$ = new Observable((observer) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          observer.next(user.uid);
          this.currentUserID = user.uid
          if (this.router.url === '/login' || '/signup' || '/recovery' || '/reset-password') {
            this.handleGoogleRedirectResult();
            this.router.navigate(['/'])
          }
        } else {
          observer.next(null);
          // No User logged in
          if (this.router.url === '/') {
            this.router.navigate(['/login'])
          }
        }
      });
    });
  }
  

  getFirestore(): Firestore {
    return this.firestore;
  }

  // Funktion zum Starten der Google-Anmeldung
  loginWithGoogle = () => {
    signInWithRedirect(this.auth, this.provider);
  };

  handleGoogleRedirectResult = () => {
    getRedirectResult(this.auth)
      .then(async (result) => {
        if (result) {
          const user = result.user;

          await this.saveUser({
            avatar: user.photoURL || '',
            name: user.displayName || '',
            email: user.email || ''
          }, user.uid);
        }
        await this.router.navigate(['/']);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Fehler nach der Umleitung: ", errorCode, errorMessage);
      });
  };

  signUpWithEmailAndPassword(email: string, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;
          resolve(user.uid); // Rückgabe der Nutzer-UID
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          reject(error); // Rückgabe des Fehlers
        });
    });
  }


  loginWithEmailAndPassword = (email: string, password: string): Promise<string | null> => {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log('Anmeldung erfolgreich', user.uid);
        this.router.navigate(['/']);
        return null;
        // ...
      })
      .catch((error) => {
        return error.code;
      });
  };

  logout() {
    signOut(this.auth).then(() => {
      // Erfolgreich ausgeloggt
      console.log("User erfolgreich ausgeloggt");
    }).catch((error) => {
      // Fehler beim Ausloggen
      console.error("Fehler beim Ausloggen: ", error);
    });
  }

  async saveUser(item: User, uid: string) {
    await setDoc(doc(this.getFirestore(), 'users', uid), {
      avatar: item.avatar,
      name: item.name,
      email: item.email,
    });
  }

  resetPassword(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      sendPasswordResetEmail(this.auth, email)
        .then(() => {
          console.log("Passwort-Reset-E-Mail gesendet.");
          resolve();
        })
        .catch((error) => {
          console.error("Fehler beim Senden der Passwort-Reset-E-Mail: ", error);
          reject(error);
        });
    });
  }

  confirmPasswordReset(code: string, newPassword: string): Promise<void> {
    return confirmPasswordReset(this.auth, code, newPassword);
  }

  async updateEmail(newEmail: string): Promise<void> {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      try {
        await updateEmail(user, newEmail);
        console.log('Email successfully updated!');

      } catch (error) {
        console.error('Error updating email:', error);
        throw error;
      }
    } else {
      throw new Error('No user logged in!');
    }
  }

  async updateUser(name: string, email: string, avatar: string) {
    const user = {
      avatar: avatar,
      name: name,
      email: email,
    }

    this.saveUser(user, this.currentUserID);
  }  
}
