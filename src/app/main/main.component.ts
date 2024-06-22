import { Component, ElementRef, ViewChild } from "@angular/core";
import { MatDrawer } from "@angular/material/sidenav";
import { ConversationsComponent } from "./conversations/conversations.component";
import { HeaderComponent } from "./header/header.component";
import { MatSidenavModule } from "@angular/material/sidenav";
import { NgClass } from "@angular/common";
import { RouterLink, RouterOutlet } from "@angular/router";
import { ThreadComponent } from "./thread/thread.component";
import { ChatComponent } from "./chat/chat.component";
import { WelcomeScreenComponent } from "./welcome-screen/welcome-screen.component";
import { DirectMessageComponent } from "./chat/direct-message/direct-message.component";
import { NewMessageComponent } from "./new-message/new-message.component";
import { ChatService } from "./chat/chat.service";
import { MatButtonModule } from "@angular/material/button";

@Component({
    selector: "app-main",
    standalone: true,
    imports: [
        HeaderComponent,
        ConversationsComponent,
        MatSidenavModule,
        ThreadComponent,
        NgClass,
        RouterLink,
        RouterOutlet,
        ChatComponent,
        WelcomeScreenComponent,
        DirectMessageComponent,
        NewMessageComponent,
        MatButtonModule,
        NgClass,
    ],
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.scss"],
})
export class MainComponent {
    threadOpen = false;
    showMenu = false;
    selectedMessageId!: string;

    @ViewChild("threadDrawer") public threadDrawer!: MatDrawer;

    constructor(public chatService: ChatService) {}

    mobileGoBack() {
        this.chatService.mobileOpen = "";
    }

    openMobileComponent(component: string) {
        this.chatService.mobileOpen = component;
    }

    openComponent(componentName: string) {
        this.chatService.setComponent(componentName);
    }

    openThread(event: { channelId: string; messageId: string }) {
        this.selectedMessageId = event.messageId;
        this.threadDrawer.open();
    }

    closeThread() {
        this.threadDrawer.close();
    }
}
