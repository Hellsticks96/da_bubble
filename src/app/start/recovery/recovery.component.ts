import { Component } from '@angular/core';
import { StartComponent } from '../start.component';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-recovery',
  standalone: true,
  imports: [ StartComponent, MatButtonModule ],
  templateUrl: './recovery.component.html',
  styleUrl: './recovery.component.scss'
})
export class RecoveryComponent {

}
