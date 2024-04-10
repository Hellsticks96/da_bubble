import { CommonModule} from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule,Router} from '@angular/router';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [MatButtonModule, CommonModule,RouterModule],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {
  @Output() threadClose = new EventEmitter<boolean>();

  constructor(){ }

  closeThread(){
    this.threadClose.emit(false);
  }
  messages = [
    {
      avatar: '4',
      name: 'Noah Braun',
      time: '14:25 Uhr',
      message: 'Welche Version ist aktuell von Angular?',
      reactions: {

      }
    },
    {
      avatar: '5',
      name: 'Sofia Müller',
      time: '14:30 Uhr',
      message: 'Ich habe die gleiche Frage. Ich habe gegoogelt und es scheint, dass die aktuelle Version Angular 13 ist. Vielleicht weiß Frederik, ob es wahr ist.',
      reactions: {
        'nerd': 1
      }
    },
    {
      avatar: '6',
      name: 'Frederik Beck',
      time: '15:06 Uhr',
      message: 'Ja das ist es.',
      reactions: {
        'hands-up': 1,
        'nerd': 3,
      }
    }
  ];

  objectKeys(obj: object) {
    return Object.keys(obj);
  }

  objectValues(obj: object) {
    return Object.values(obj);
  }

  objectKeysLength(obj: object | string) {
    return Object.keys(obj).length;
  }
}
