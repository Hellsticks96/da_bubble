import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
            FormsModule,
            CommonModule,
            MatCardModule, 
            MatButtonModule,
            MatInputModule,
            MatIconModule,
            MatFormFieldModule,
          ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor() { }

  login(): void {
    console.log(`Login attempt with username: ${this.email} and password: ${this.password}`);
    // Füge hier die Logik für die Authentifizierung hinzu
  }
}
