import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DialogAddMemberToChnlComponent } from '../../dialog-add-member-to-chnl/dialog-add-member-to-chnl.component';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { DialogChannelInfoComponent } from '../../dialog-channel-info/dialog-channel-info.component';
import { DialogShowChannelMemberComponent } from '../../dialog-show-channel-member/dialog-show-channel-member.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { DialogEditMessageComponent } from '../../dialog-edit-message/dialog-edit-message.component';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatDialogModule,
    MatMenuModule,
    PickerComponent
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  isPickerVisible = false;
  messages = [
    {
      id: 1,
      avatar: '4',
      name: 'Noah Braun',
      time: '14:25 Uhr',
      message: 'Welche Version ist aktuell von Angular?',
      reactions: {

      }
    },
    {
      id: 2,
      avatar: '5',
      name: 'Sofia Müller',
      time: '14:30 Uhr',
      message: 'Ich habe die gleiche Frage. Ich habe gegoogelt und es scheint, dass die aktuelle Version Angular 13 ist. Vielleicht weiß Frederik, ob es wahr ist.',
      reactions: {
        'nerd': 1
      }
    },
    {
      id: 3,
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
  constructor(public dialog: MatDialog, private router: Router,private route: ActivatedRoute) {

  }
  addEmoji(event: any) {
    console.log(event.emoji);
  }


  togglePicker() {
    this.isPickerVisible = !this.isPickerVisible;
  }
  objectKeys(obj: object) {
    return Object.keys(obj);
  }

  objectValues(obj: object) {
    return Object.values(obj);
  }

  objectKeysLength(obj: object | string) {
    return Object.keys(obj).length;
  }

  openDialogAddMembers() {
    this.dialog.open(DialogAddMemberToChnlComponent, {
      panelClass: 'custom-dialog-br',
    })
  }

  openDialogEditMessage(id: number){
    const message = this.messages.find((message) => message.id === id)
    if (message === undefined) throw new Error(`Couldn't find message with id ${id}`);
    this.dialog.open(DialogEditMessageComponent,{
      panelClass:'custom-dialog-br',
      data: {message : message.message}
    })
  }


  openDialogChannelInfo() {
    this.dialog.open(DialogChannelInfoComponent, {
      panelClass: 'custom-dialog-br',
    })
  }
  navigateToThread() {
    this.router.navigate(['/main', {outlets: {'threadOutlet': ['thread']}}]);
  }

  openDialogShowMembers(){
    this.dialog.open(DialogShowChannelMemberComponent,{
      panelClass:'custom-dialog-br',
    })
  }
  openDialog(event: MouseEvent): void {
    let element = event.target as Element | null;

    if (element) {
      let htmlElement = element as HTMLElement;
      let boundingClientRect = htmlElement.getBoundingClientRect();

      let dialogPosition = {
        top: `${boundingClientRect.bottom + window.scrollY + 15}px`,
        left: `${boundingClientRect.left + window.scrollX - 280}px`,
      };

      this.dialog.open(DialogShowChannelMemberComponent, { // Ersetzen Sie DialogSomeComponent durch Ihre tatsächliche Dialogkomponente
        width: '350px',
        position: dialogPosition,
      });
    }
  }
}
