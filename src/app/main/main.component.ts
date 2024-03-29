import { Component } from '@angular/core';
import { StartComponent } from '../start/start.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [StartComponent,
            FormsModule,
            
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
