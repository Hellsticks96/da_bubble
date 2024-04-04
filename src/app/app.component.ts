import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { FirestoreService } from './firestore.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [trigger, transition, animate, style]
})
export class AppComponent {
  title = 'DABubble';

  constructor(private firestore: FirestoreService) {
    this.firestore.currentUser$.subscribe(uid => {
      console.log('Aktuelle Benutzer UID:', uid);
      // Führen Sie hier Aktionen aus, die vom aktuellen Benutzerstatus abhängen
    });
    // TODO: does this have to be implemented in every component?
  }
}
