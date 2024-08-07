import { CommonModule } from "@angular/common";
import {
    Component,
    EventEmitter,
    Output,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges,
    HostListener,
    ViewChild,
    ElementRef,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { ChatService } from "../chat/chat.service";
import { Message } from "../../interfaces/message";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";;
import { CurrentuserService } from "../../currentuser.service";
import { EmojiModule } from "@ctrl/ngx-emoji-mart/ngx-emoji";
import { PickerComponent } from "@ctrl/ngx-emoji-mart";
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { map, Observable, startWith } from "rxjs";
import { UsersList } from "../../interfaces/users-list";

@Component({
    selector: "app-thread",
    standalone: true,
    imports: [MatButtonModule, CommonModule, 
    RouterModule, 
    FormsModule, 
    PickerComponent,
    EmojiModule,
    MatAutocompleteModule,
    ReactiveFormsModule],
    templateUrl: "./thread.component.html",
    styleUrls: ["./thread.component.scss"],
})
export class ThreadComponent implements OnInit, OnChanges {
    @Input() channelId!: string;
    @Input() messageId!: string;
    @Output() threadClose = new EventEmitter<boolean>();
    @ViewChild("messageInput") messageInput!: ElementRef<HTMLInputElement>;
    messages: Message[] = [];
    messageText: string = "";
    isPickerVisible = false;
    pickerContext: string = "";
    currentMessagePadnumber: string = "";
    currentInputValue: string = "";
    formCtrl = new FormControl();
    filteredMembers: Observable<UsersList[]>;

    constructor(
        private chatService: ChatService,
        public currentUser: CurrentuserService,
    ) {
        this.filteredMembers = this.formCtrl.valueChanges.pipe(
            startWith(""),
            map((value: string | null) => (value ? this._filter(value) : [])),
        );
    }

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
                btnReactions: [],
                imageUrl: ''
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
    showTooltip(key: string, value: number) {
        const tooltip = document.getElementById("customTooltip");
        if (tooltip) {
            const content = `<div> 
                          <img src="../../../assets/img/icons/emoji-${key}.svg">
                          <span>${value}</span> 
                       </div>`;

            tooltip.innerHTML = content;
            tooltip.style.display = "block";
            tooltip.style.left = `${+20}px`;
            tooltip.style.top = `- 300px`;
        }
    }

    hideTooltip() {
        const tooltip = document.getElementById("customTooltip");
        if (tooltip) {
            tooltip.style.display = "none";
        }
    }

    onKeydown(event: KeyboardEvent) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            this.send();
        }
    }

    onInputChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.currentInputValue = input.value;
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        const selectedUserName = event.option.viewValue;
        this.formCtrl.setValue("", { emitEvent: false });
        this.messageText = this.currentInputValue + `${selectedUserName} `;
        this.currentInputValue = this.messageText;
        this.messageInput.nativeElement.focus();
    }

    private _filter(value: string): UsersList[] {
        if (this.mentionUser(value)) {
            const filterValue = value
                .slice(value.lastIndexOf("@") + 1)
                .toLowerCase();
            return this.chatService.usersList.filter((user) =>
                user.name.toLowerCase().includes(filterValue),
            );
        } else {
            return [];
        }
    }

    mentionUser(value: string): boolean {
        const atIndex = value.lastIndexOf("@");
        if (atIndex === -1) return false;
        const charAfterAt = value.charAt(atIndex + 1);
        return charAfterAt !== " ";
    }

    addAtSymbol() {
        if (this.messageText.slice(-1) !== "@") {
            this.messageText += "@";
            this.currentInputValue += "@";
        }
        this.messageInput.nativeElement.focus();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        this.isPickerVisible = false;
    }

    togglePicker(context: string, padNr: any, event: MouseEvent) {
        this.isPickerVisible = !this.isPickerVisible;
        this.pickerContext = context;
        this.currentMessagePadnumber = padNr;

    }

    addEmoji(event: any) {
        if (this.pickerContext === "input") {
            this.messageText += event.emoji.native;
        } else if (this.pickerContext === "reaction") {
            this.addReactionToMessage(
                this.currentMessagePadnumber,
                event.emoji.native,
            );
        }
    }
    addReactionToMessage(messagePadnr: string, emoji: string) {
        console.log(this.messageId, messagePadnr)
        this.chatService
            .addReaction(this.messageId, emoji, 'thread',messagePadnr)
            .then(() => console.log("Reaction added"))
            .catch((error) => console.error("Error adding reaction: ", error));
    }

    addOrSubReaction(message: any, reaction: any, ) {
        console.log(message.padNumber, reaction)
        this.chatService.addOrSubReaction(message, reaction, 'thread',this.messageId)
    }

    closePicker(event: Event) {
        if (this.isPickerVisible) {
            this.isPickerVisible = false;
            this.pickerContext = "";
            this.currentMessagePadnumber = "";
        }
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
