import { Component} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';



@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [MatExpansionModule, MatButtonToggleModule],
  templateUrl: './conversations.component.html',
  styleUrl: './conversations.component.scss'
})
export class ConversationsComponent {
}
