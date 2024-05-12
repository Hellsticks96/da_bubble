import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';
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
import { serverTimestamp } from '@angular/fire/firestore';
import { Channel } from '../../interfaces/channel';


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
export class ChatComponent implements AfterViewInit, AfterViewChecked {
  @Output() threadOpen = new EventEmitter<boolean>();
  @Output() mobileOpen = new EventEmitter<string>();
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  messageText: string = '';
  isPickerVisible = false;
  public currentChannel!: Channel;

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleThread() {
    this.threadOpen.emit(!this.threadOpen);
    if (window.matchMedia('(max-width: 431px)').matches) {
      this.mobileOpen.emit('thread');
    }
  }

  constructor(
    public dialog: MatDialog,
    public chatService: ChatService) {

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

  openDialogAddMembers(event: MouseEvent): void {
    let element = event.target as Element | null;

    if (element) {
      let htmlElement = element as HTMLElement;
      let boundingClientRect = htmlElement.getBoundingClientRect();

      let dialogPosition = {
        top: `${boundingClientRect.bottom + window.scrollY + 13.75}px`,
        right: `${window.innerWidth - boundingClientRect.left - boundingClientRect.width + window.scrollX}px`
      };

      this.dialog.open(DialogAddMemberToChnlComponent, { // Ersetzen Sie DialogSomeComponent durch Ihre tatsächliche Dialogkomponente
        position: dialogPosition,
        panelClass: 'custom-dialog-br',
      });
    }
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
        top: `${boundingClientRect.bottom + window.scrollY + 13.75}px`,
        right: `${window.innerWidth - boundingClientRect.left - boundingClientRect.width + window.scrollX}px`
      };

      this.dialog.open(DialogShowChannelMemberComponent, { // Ersetzen Sie DialogSomeComponent durch Ihre tatsächliche Dialogkomponente
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
      tooltip.style.top = `- 300px`;
    }
  }


  hideTooltip() {
    const tooltip = document.getElementById('customTooltip');
    if (tooltip) {
      tooltip.style.display = 'none'; // Tooltip verstecken
    }
  }
  async send() {
    if (this.messageText.trim() !== '') {
      const message: Message = {
        avatar: '',
        name: '', // wird im chat.service übernommen 
        time: new Date().toISOString(),
        message: this.messageText,
        createdAt: serverTimestamp(),
        reactions: {}
      };

      await this.chatService.sendMessage(this.chatService.currentChannelID, message);
      await this.scrollToBottom();
      this.messageText = ''; // Textfeld nach dem Senden leeren
    }
  }

  async scrollToBottom(): Promise<void> {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  emptyChannel() {
    if (this.chatService.currentChannel.messages) {
      return this.chatService.currentChannel.messages?.size === 0;
    } else {
      return false;
    }
  }
  // TODO: optimize scroll to bottom (only after sending a message and when opening the chat)
}
