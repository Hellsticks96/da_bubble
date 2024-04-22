import { Component } from '@angular/core';
import { CurrentuserService } from '../../currentuser.service';

@Component({
  selector: 'app-welcome-screen',
  standalone: true,
  imports: [],
  templateUrl: './welcome-screen.component.html',
  styleUrl: './welcome-screen.component.scss'
})
export class WelcomeScreenComponent {
  constructor(private currentUser: CurrentuserService) {
    console.log(currentUser.isLoggedIn);
  }

}
