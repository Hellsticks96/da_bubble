import {
    Component,
    ElementRef,
    EventEmitter,
    Output,
    ViewChild,
    AfterViewInit,
    AfterViewChecked,
    CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { DialogAddMemberToChnlComponent } from "../../dialog-add-member-to-chnl/dialog-add-member-to-chnl.component";
import { MatMenu, MatMenuModule } from "@angular/material/menu";
import { DialogChannelInfoComponent } from "../../dialog-channel-info/dialog-channel-info.component";
import { DialogShowChannelMemberComponent } from "../../dialog-show-channel-member/dialog-show-channel-member.component";
import { PickerComponent } from "@ctrl/ngx-emoji-mart";
import { DialogEditMessageComponent } from "../../dialog-edit-message/dialog-edit-message.component";
import { ChatService } from "./chat.service";
import { MainComponent } from "../main.component";
import { Message } from "../../interfaces/message";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { serverTimestamp } from "@angular/fire/firestore";
import { Channel } from "../../interfaces/channel";
import { CurrentuserService } from "../../currentuser.service";
import {
    MatAutocompleteModule,
    MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import { Observable, map, startWith } from "rxjs";
import { UsersList } from "../../interfaces/users-list";
import { MatInputModule } from "@angular/material/input";
import { HighlightMentionsPipe } from "../../pipes/highlist-mentions.pipe";
import { PofileInfoCardComponent } from "../../pofile-info-card/pofile-info-card.component";
import { ImageService } from "../../image.service";
import { EmojiModule } from "@ctrl/ngx-emoji-mart/ngx-emoji";
@Component({
    selector: "app-chat",
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
        MatFormFieldModule,
        MatAutocompleteModule,
        MatInputModule,
        ReactiveFormsModule,
        HighlightMentionsPipe,
        PofileInfoCardComponent,
        EmojiModule,
    ],
    templateUrl: "./chat.component.html",
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    styleUrls: ["./chat.component.scss"],
})
export class ChatComponent implements AfterViewInit, AfterViewChecked {
    @Output() threadOpen = new EventEmitter<{
        channelId: string;
        messageId: string;
    }>();
    @ViewChild("chatContainer") private chatContainer!: ElementRef;
    messagesArrayLength: number |undefined;
    messageText: string = "";
    isPickerVisible = false;
    pickerContext: string = "";
    currentMessagePadnumber: string = "";
    formCtrl = new FormControl();
    filteredMembers: Observable<UsersList[]>;
    showUserlist = false;
    public currentChannel!: Channel;
    currentInputValue: string = "";

    @ViewChild("messageInput") messageInput!: ElementRef<HTMLInputElement>;
    @ViewChild("message") message!: ElementRef<HTMLInputElement>;

    constructor(
        public dialog: MatDialog,
        public chatService: ChatService,
        public currentUser: CurrentuserService,
        public imageService: ImageService,
    ) {
        this.filteredMembers = this.formCtrl.valueChanges.pipe(
            startWith(""),
            map((value: string | null) => (value ? this._filter(value) : [])),
        );
    }

    ngAfterViewInit() {
        if (this.chatService.currentChannel.messages)
        this.messagesArrayLength = this.chatService.currentChannel.messages.size
        this.scrollToBottom();
    }

    ngAfterViewChecked() {
        if (this.messagesArrayLength !== this.chatService.currentChannel.messages?.size)
        this.scrollToBottom();
    }

    toggleThread(channelId: string, messageId: string) {
        this.threadOpen.emit({ channelId, messageId });
        if (window.matchMedia("(max-width: 431px)").matches) {
            this.chatService.mobileOpen = "thread";
        }
    }

    onMessageClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (target.classList.contains("highlight-mention")) {
            const username = target.getAttribute("data-username");
            if (username) {
                this.openProfileCard(username);
            } else {
                console.error("Kein Benutzername definiert für dieses Element");
            }
        }
    }

    openProfileCard(username: string) {
        const user = this.chatService.usersList.find(
            (u) => u.name === username,
        );
        if (user) {
            this.dialog.open(PofileInfoCardComponent, {
                data: user,
            });
        } else {
            console.log("Benutzer nicht gefunden");
        }
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

    togglePicker(context: string, padNr: any) {
        this.isPickerVisible = !this.isPickerVisible;
        this.pickerContext = context;
        this.currentMessagePadnumber = padNr;
    }

    addReactionToMessage(messagePadnr: string, emoji: string) {
        this.chatService
            .addReaction(messagePadnr, emoji)
            .then(() => console.log("Reaction added"))
            .catch((error) => console.error("Error adding reaction: ", error));
    }

    closePicker(event: Event) {
        if (this.isPickerVisible) {
            this.isPickerVisible = false;
            this.pickerContext = "";
            this.currentMessagePadnumber = "";
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

            if (window.matchMedia("(max-width: 768px)").matches) {
                dialogPosition = {
                    top: `${boundingClientRect.bottom + window.scrollY + 10}px`,
                };
            } else {
                dialogPosition = {
                    top: `${boundingClientRect.bottom + window.scrollY + 13.75}px`,
                    right: `${window.innerWidth - boundingClientRect.left - boundingClientRect.width + window.scrollX}px`,
                };
            }

            this.dialog.open(DialogAddMemberToChnlComponent, {
                position: dialogPosition,
                panelClass: "custom-dialog-br",
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
            panelClass: "custom-dialog-br",
        });
    }

    openDialogShowMembers() {
        this.dialog.open(DialogShowChannelMemberComponent, {
            panelClass: "custom-dialog-br",
        });
    }

    openDialog(event: MouseEvent): void {
        let element = event.target as Element | null;

        if (element) {
            let htmlElement = element as HTMLElement;
            let boundingClientRect = htmlElement.getBoundingClientRect();

            let dialogPosition = {
                top: `${boundingClientRect.bottom + window.scrollY + 13.75}px`,
                right: `${window.innerWidth - boundingClientRect.left - boundingClientRect.width + window.scrollX}px`,
            };

            this.dialog.open(DialogShowChannelMemberComponent, {
                position: dialogPosition,
            });
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

    async send() {
        if (this.messageText.trim() !== "") {
            const message: Message = {
                id: "",
                avatar: "",
                name: "",
                time: new Date().toISOString(),
                message: this.messageText,
                createdAt: serverTimestamp(),
                reactions: {},
                padNumber: "",
                btnReactions: []
            };

            await this.chatService.sendMessage(
                this.chatService.currentChannelID,
                message,
            );
            await this.scrollToBottom();
            this.messageText = "";
        }
    }

    onKeydown(event: KeyboardEvent) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            this.send();
        }
    }

    async scrollToBottom(): Promise<void> {
        try {
            this.chatContainer.nativeElement.scrollTop =
                this.chatContainer.nativeElement.scrollHeight;
        } catch (err) {
            console.error("Error scrolling to bottom:", err);
        }
    }

    emptyChannel() {
        if (this.chatService.currentChannel.messages) {
            return this.chatService.currentChannel.messages?.size === 0;
        } else {
            return false;
        }
    }

    padNumber(num: number, size: number) {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    isLater(newMessageTime: string, index: number): boolean {
        const previousMessage = this.chatService.currentChannel.messages?.get(
            this.padNumber(index, 4),
        );
        if (!previousMessage) {
            return false;
        }

        const previousMessageTime = previousMessage.time;
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

    openProfile(username: string): void {
        console.log("Clicked mention:", username);
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

    mentionUser(value: string): boolean {
        const atIndex = value.lastIndexOf("@");
        if (atIndex === -1) return false;
        const charAfterAt = value.charAt(atIndex + 1);
        return charAfterAt !== " ";
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

    addAtSymbol() {
        if (this.messageText.slice(-1) !== "@") {
            this.messageText += "@";
            this.currentInputValue += "@";
        }
        this.messageInput.nativeElement.focus();
    }

    addOrSubReaction(message: any, reaction: any) {
        this.chatService.addOrSubReaction(message, reaction)
    }

}
