import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ChatService } from '../chat/chat.service';
import { Message } from '../../interfaces/message';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [MatButtonModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit {
  @Input() channelId!: string;
  @Input() messageId!: string;
  @Output() threadClose = new EventEmitter<boolean>();
  messages: Message[] = [];
  messageText: string = '';
  isPickerVisible = false;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.loadMessages();
  }

  closeThread() {
    this.threadClose.emit(false);
    if (window.matchMedia('(max-width: 768px)').matches) {
      this.chatService.mobileOpen = 'chat';
    }
  }

  loadMessages() {
    this.chatService.loadThreadMessages(this.channelId, this.messageId).subscribe(messages => {
      this.messages = messages;
    });
  }

  async send() {
    if (this.messageText.trim() !== '') {
      const message: Message = {
        id: '',
        avatar: '',
        name: '',
        time: new Date().toISOString(),
        message: this.messageText,
        createdAt: new Date(),
        reactions: {}
      };
      await this.chatService.sendThreadMessage(this.channelId, this.messageId, message);
      this.messageText = '';
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  togglePicker() {
    this.isPickerVisible = !this.isPickerVisible;
  }

  addEmoji(event: any) {
    this.messageText += event.emoji.native;
  }

  objectKeys(obj: object): string[] {
    return Object.keys(obj);
  }

  objectValues(obj: object): any[] {
    return Object.values(obj);
  }

  objectKeysLength(obj: object | string): number {
    return Object.keys(obj).length;
  }
}
