import { Component } from '@angular/core';
import { StartComponent } from '../start.component';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ StartComponent, MatButtonModule ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

}
