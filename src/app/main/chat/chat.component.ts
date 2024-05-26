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
import { CurrentuserService } from '../../currentuser.service';
import { ImageService } from '../../image.service';


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
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  messageText: string = '';
  isPickerVisible = false;
  public currentChannel!: Channel;

  constructor(
    public dialog: MatDialog,
    public chatService: ChatService,
    public currentUser: CurrentuserService,
    public imageService: ImageService) { }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  log(){
    console.log(this.imageService.storage)
  }

  toggleThread() {
    this.threadOpen.emit(!this.threadOpen);
    if (window.matchMedia('(max-width: 431px)').matches) {
      this.chatService.mobileOpen = 'thread';
    }
  }


  addEmoji(event: any) {
    this.messageText += event.emoji.native;
  }

  togglePicker() {
    this.isPickerVisible = !this.isPickerVisible;
  }
  closePicker(event: Event) {
    if (this.isPickerVisible) {
      this.isPickerVisible = false;
    }
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
      let dialogPosition;

      if (window.matchMedia('(max-width: 431px)').matches) {
        dialogPosition = {
          top: `${boundingClientRect.bottom + window.scrollY + 10}px`,
        };
      } else {
        dialogPosition = {
          top: `${boundingClientRect.bottom + window.scrollY + 13.75}px`,
          right: `${window.innerWidth - boundingClientRect.left - boundingClientRect.width + window.scrollX}px`
        };
      }



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
        id: '',
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

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Verhindert den Zeilenumbruch
      this.send(); // Nachricht senden
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

  isLater(newMessageTime: string, index: string): boolean {
    const previousMessage = this.chatService.currentChannel.messages?.get(index);

    if (!previousMessage) {
      return false;
    }

    const previousMessageTime = previousMessage.time;

    const previousMessageDate = new Date(previousMessageTime).setHours(0, 0, 0, 0);
    const newMessageDate = new Date(newMessageTime).setHours(0, 0, 0, 0);

    return newMessageDate > previousMessageDate;
  }

  dayDate(timestamp: string): string {
    const date = new Date(timestamp);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    const dateToCompare = new Date(date).setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (dateToCompare === today.getTime()) {
      return "Heute";
    } else if (dateToCompare === yesterday.getTime()) {
      return "Gestern";
    }

    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('de-DE', options);
  }

  dayTime(timestamp: string): string {
    const date = new Date(timestamp);

    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    return date.toLocaleTimeString('de-DE', options);
  }

  // TODO: optimize scroll to bottom (only after sending a message and when opening the chat)
}
