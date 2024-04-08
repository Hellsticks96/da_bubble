import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DialogAddMemberToChnlComponent } from '../../dialog-add-member-to-chnl/dialog-add-member-to-chnl.component';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { DialogChannelInfoComponent } from '../../dialog-channel-info/dialog-channel-info.component';
import { DialogShowChannelMemberComponent } from '../../dialog-show-channel-member/dialog-show-channel-member.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { DialogEditMessageComponent } from '../../dialog-edit-message/dialog-edit-message.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from './chat.service';

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

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    public chatService: ChatService
  ) {
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
    });
  }

  openDialogEditMessage(id: number) {
    // const message = this.chatService.messages.find((message) => message.id === id);
    // if (message === undefined) throw new Error(`Couldn't find message with id ${id}`);
    // this.dialog.open(DialogEditMessageComponent, {
    //   panelClass: 'custom-dialog-br',
    //   data: { message: message.message }
    // });
  }


  openDialogChannelInfo() {
    this.dialog.open(DialogChannelInfoComponent, {
      panelClass: 'custom-dialog-br',
    });
  }
  navigateToThread() {
    this.router.navigate(['/main', { outlets: { 'threadOutlet': ['thread'] } }]);
  }

  openDialogShowMembers() {
    this.dialog.open(DialogShowChannelMemberComponent, {
      panelClass: 'custom-dialog-br',
    });
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
