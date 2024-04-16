import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DialogAddMemberToChnlComponent } from '../../dialog-add-member-to-chnl/dialog-add-member-to-chnl.component';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { DialogChannelInfoComponent } from '../../dialog-channel-info/dialog-channel-info.component';
import { DialogShowChannelMemberComponent } from '../../dialog-show-channel-member/dialog-show-channel-member.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { DialogEditMessageComponent } from '../../dialog-edit-message/dialog-edit-message.component';
import { ChatService } from './chat.service';
import { MainComponent } from '../main.component';
import { Message } from '../../interfaces/message';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatDialogModule,
    MatMenuModule,
    PickerComponent,
    MainComponent,
    FormsModule,
    MatFormFieldModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  @Output()threadOpen = new EventEmitter<boolean>();
  messageText: string = '';
  isPickerVisible = false;

  navigateToThread() {
    this.threadOpen.emit(true);
  }
  
  constructor(
    public dialog: MatDialog,
    public chatService: ChatService){

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

  openDialogEditMessage(id: string) {
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

  showTooltip(key: string, value: number) {
    const tooltip = document.getElementById('customTooltip');
    if (tooltip) {
      // Dynamisches Erstellen des HTML-Inhalts mit den übergebenen Parametern
      const content = `<div> 
                          <img src="../../../assets/img/icons/emoji-${key}.svg">
                          <span>${value}</span> 
                       </div>`;
  
      tooltip.innerHTML = content;
      tooltip.style.display = 'block';
      tooltip.style.left = `${+20}px`;
    tooltip.style.top = `- 300px`
    }
  }
  
  
  hideTooltip() {
    const tooltip = document.getElementById('customTooltip');
    if (tooltip) {
      tooltip.style.display = 'none'; // Tooltip verstecken
    }
  }
  async send() {
    console.log(this.messageText)
    if (this.messageText.trim() !== '') {
      const message: Message = {
        avatar: '', // Hier könnten Sie Benutzerdaten hinzufügen
        name: 'Benutzername',
        time: new Date().toISOString(), // ISO String als eindeutigen Schlüssel
        message: this.messageText,
        reactions: new Map() // Leere Map für Reaktionen initialisieren
      };

      await this.chatService.sendMessage(this.chatService.currentChannelID, message);
      this.messageText = ''; // Textfeld nach dem Senden leeren
    }
  }

}
