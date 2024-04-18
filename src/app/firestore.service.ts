import { Injectable, inject } from '@angular/core';
import { list } from '@angular/fire/database';
import { CollectionReference, DocumentData, Firestore, collection, collectionData, doc, onSnapshot, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, confirmPasswordReset } from "firebase/auth";
import { Router } from '@angular/router';
import { signOut } from '@angular/fire/auth';
import { User } from './interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  doc(ref: CollectionReference<DocumentData, DocumentData>, id: string): import("@firebase/firestore").DocumentReference<unknown, import("@firebase/firestore").DocumentData> {
    throw new Error('Method not implemented.');
  }
  firestore: Firestore = inject(Firestore);
  // items$: Observable<any[]>;
  auth = getAuth();
  provider = new GoogleAuthProvider();
  currentUser$: Observable<string | null>;
  usersRef = collection(this.firestore, 'users');
  channelsRef = collection(this.firestore, 'channels');

  constructor(private router: Router) {
    this.currentUser$ = new Observable((observer) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          observer.next(user.uid);
        } else {
          observer.next(null);
          // No User logged in
          if (this.router.url === '/') {
            this.router.navigate(['/login'])
          }
        }
      });
    });
    // this.items$ = collectionData(aCollection);

    // const test = onSnapshot(aCollection, (list) => {
    //   list.forEach((item) => {
    //     console.log(item.data());
    //   });
    // });
  }

  getFirestore(): Firestore {
    return this.firestore;
  }

  // Funktion zum Starten der Google-Anmeldung
  loginWithGoogle = () => {
    signInWithPopup(this.auth, this.provider)
      .then((result) => {
        // Dies gibt dir ein Google Access Token. Du kannst es verwenden, um auf Google APIs zuzugreifen.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) throw new Error('Invalid Credential');
        const token = credential.accessToken;
        // Die angemeldete Benutzerinformationen.
        const user = result.user;
        // Weiteren Code hier einfügen, z.B. Weiterleitung oder Nutzerprofil aktualisieren
      }).catch((error) => {
        // Fehlerbehandlung
        const errorCode = error.code;
        const errorMessage = error.message;
        // Der E-Mail des Benutzers, der sich anzumelden versucht hat
        const email = error.email;
        // Der AuthCredential-Typ, der fehlgeschlagen ist.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
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
}
