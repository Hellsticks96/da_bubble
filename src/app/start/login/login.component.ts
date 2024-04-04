import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { StartComponent } from '../start.component';
import { FirestoreService } from '../../firestore.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
            FormsModule,
            CommonModule,
            MatButtonModule,
            StartComponent
          ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private firestore: FirestoreService) { 

  }

  login(): void {
    console.log(`Login attempt with username: ${this.email} and password: ${this.password}`);
    // Füge hier die Logik für die Authentifizierung hinzu
  }

    // Google Anmeldung
    async loginWithGoogle() {
      return this.firestore.loginWithGoogle();
    }

    async loginWithEmailAndPassword() {
      return this.firestore.loginWithEmailAndPassword(this.email, this.password);
    }
}
