import { CommonModule } from "@angular/common";
import {
    Component,
    EventEmitter,
    Output,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { ChatService } from "../chat/chat.service";
import { Message } from "../../interfaces/message";
import { FormsModule } from "@angular/forms";
import { CurrentuserService } from "../../currentuser.service";

@Component({
    selector: "app-thread",
    standalone: true,
    imports: [MatButtonModule, CommonModule, RouterModule, FormsModule],
    templateUrl: "./thread.component.html",
    styleUrls: ["./thread.component.scss"],
})
export class ThreadComponent implements OnInit, OnChanges {
    @Input() channelId!: string;
    @Input() messageId!: string;
    @Output() threadClose = new EventEmitter<boolean>();
    messages: Message[] = [];
    messageText: string = "";
    isPickerVisible = false;

    constructor(
        private chatService: ChatService,
        public currentUser: CurrentuserService,
    ) {}

    ngOnInit() {
        this.loadMessages();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes["channelId"] || changes["messageId"]) {
            this.loadMessages();
        }
    }

    closeThread() {
        this.threadClose.emit(false);
        if (window.matchMedia("(max-width: 768px)").matches) {
            this.chatService.mobileOpen = "chat";
        }
    }

    loadMessages() {
        this.chatService
            .loadThreadMessages(this.channelId, this.messageId)
            .subscribe((messages) => {
                this.messages = messages;
            });
    }

    async send() {
        if (this.messageText.trim() !== "") {
            const message: Message = {
                id: "",
                avatar: "",
                name: "",
                time: new Date().toISOString(),
                message: this.messageText,
                createdAt: new Date(),
                reactions: {},
                padNumber: "",
            };
            await this.chatService.sendThreadMessage(
                this.channelId,
                this.messageId,
                message,
            );
            this.messageText = "";
            this.loadMessages();
        }
    }

    onKeydown(event: KeyboardEvent) {
        if (event.key === "Enter" && !event.shiftKey) {
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

    objectKeys(obj: any): string[] {
        return Object.keys(obj);
    }

    objectValues(obj: any): any[] {
        return Object.values(obj);
    }

    objectKeysLength(obj: any | string): number {
        return Object.keys(obj).length;
    }

    isLater(
        newMessageTime: string | undefined,
        previousMessageTime: string | undefined,
    ): boolean {
        if (!newMessageTime || !previousMessageTime) {
            return false;
        }

        const previousMessageDate = new Date(previousMessageTime).setHours(
            0,
            0,
            0,
            0,
        );
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

        const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            day: "numeric",
            month: "long",
        };
        return date.toLocaleDateString("de-DE", options);
    }

    dayTime(timestamp: string): string {
        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        };
        return date.toLocaleTimeString("de-DE", options);
    }
}
