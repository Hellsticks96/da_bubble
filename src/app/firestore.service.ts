import { Injectable, inject } from '@angular/core';
import { list } from '@angular/fire/database';
import { Firestore, collection, collectionData, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  firestore: Firestore = inject(Firestore);
  items$: Observable<any[]>;
  auth = getAuth();
  provider = new GoogleAuthProvider();

  constructor() {
    const aCollection = collection(this.firestore, 'test');
    this.items$ = collectionData(aCollection);

    const test = onSnapshot(aCollection, (list) => {
      list.forEach((item) => {
        console.log(item.data());
      });
    });
  }

  // Funktion zum Starten der Google-Anmeldung
  signInWithGoogle = () => {
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

  signUpWithEmailAndPassword = (email: string, password: string) => {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  signInWithEmailAndPassword = (email: string, password: string) => {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log('Anmeldung erfolgreich');
        // ...
      })
      .catch((error) => {
        console.log('Anmeldung fehlgeschlagen');
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };
}
