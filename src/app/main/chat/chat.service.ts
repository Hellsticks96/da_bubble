import { Injectable } from "@angular/core";
import { FirestoreService } from "../../firestore.service";
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    getDocs,
    serverTimestamp,
    getDoc,
    updateDoc,
} from "@angular/fire/firestore";
import { Channel } from "../../interfaces/channel";
import { Message } from "../../interfaces/message";
import { CurrentuserService } from "../../currentuser.service";
import { UsersList } from "../../interfaces/users-list";
import { ChannelsList } from "../../interfaces/channels-list";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class ChatService {
    channels: Record<string, Channel> = {};
    currentChannel: Channel = {
        name: "",
        description: "",
        creator: "",
        members: [],
        messages: new Map(),
    };
    channelsList: ChannelsList[] = [];
    currentChannelID = "";
    usersList: UsersList[] = [];
    openComponent: "directMessage" | "newMessage" | "chat" | string = "";
    selectedChannel = "";
    selectedDirectmessage = "";
    mobileOpen = "";
    selectedPadnumber: string = ""; // Hier speichern wir die padnumber
    selectedUser: UsersList = {
        id: "",
        name: "",
        avatar: "",
        email: "",
        online: false,
    };
    collectionPath = '';
    pathNr = '';
    

    constructor(
        public firestore: FirestoreService,
        public currentUser: CurrentuserService,
    ) {
        this.subUsersList();
        this.subChannelsList();
    }

    subChannelsList() {
        let ref = this.firestore.channelsRef;
        return onSnapshot(ref, (list) => {
            this.channelsList = [];
            list.forEach((element) => {
                this.channelsList.push(
                    this.setChannelsListObj(element.data(), element.id),
                );
            });
        });
    }

    setChannelsListObj(obj: any, id: string): ChannelsList {
        return {
            id: id || "",
            channelData: obj || null,
        };
    }

    openChannel(channelId: string) {
        this.selectedChannel = channelId;
        this.selectedDirectmessage = "";
        this.loadChannel(channelId);
        if (window.matchMedia("(max-width: 768px)").matches) {
            this.mobileOpen = "chat";
        }
    }

    openDirectMessage(user: UsersList) {
        this.selectedDirectmessage = user.id;
        this.selectedChannel = "";
        this.selectedUser = user;
        if (window.matchMedia("(max-width: 768px)").matches) {
            this.mobileOpen = "directmessage";
        }
    }

    loadChannel(id: string) {
        const channelRef = this.firestore.channelsRef;
        const channelDocRef = doc(channelRef, id);
        const messagesCollectionRef = collection(channelDocRef, "messages");

        const messagesQuery = query(messagesCollectionRef, orderBy("time"));

        return onSnapshot(messagesQuery, (querySnapshot) => {
            if (!this.channels[id]) {
                this.channels[id] = {
                    name: "",
                    description: "",
                    creator: "",
                    members: [],
                    messages: new Map(),
                };
            }

            querySnapshot.forEach((doc) => {
                const messageData = doc.data() as Message;
                this.channels[id].messages?.set(doc.id, messageData);
            });

            onSnapshot(doc(channelRef, id), (docSnap) => {
                if (docSnap.exists()) {
                    this.channels[id].name = docSnap.data()["name"];
                    this.channels[id].creator = docSnap.data()["creator"];
                    this.channels[id].members = docSnap.data()["members"] || [];
                    this.channels[id].description =
                        docSnap.data()["description"] || "";
                }
            });

            this.currentChannel = this.channels[id];
            this.currentChannelID = id;
        });
    }

    loadMessages(channelId: string): Observable<Message[]> {
        const messagesRef = collection(
            this.firestore.firestore,
            `channels/${channelId}/messages`,
        );
        const messagesQuery = query(messagesRef, orderBy("time"));

        return new Observable((observer) => {
            onSnapshot(messagesQuery, (snapshot) => {
                const messages: Message[] = [];
                snapshot.forEach((doc) => {
                    messages.push(doc.data() as Message);
                });
                observer.next(messages);
            });
        });
    }

    loadThreadMessages(
        channelId: string,
        messageId: string,
    ): Observable<Message[]> {
        const threadMessagesRef = collection(
            this.firestore.firestore,
            `channels/${channelId}/messages/${messageId}/threads`,
        );
        const threadMessagesQuery = query(threadMessagesRef, orderBy("time"));

        return new Observable((observer) => {
            onSnapshot(threadMessagesQuery, (snapshot) => {
                const messages: Message[] = [];
                snapshot.forEach((doc) => {
                    messages.push(doc.data() as Message);
                });
                observer.next(messages);
            });
        });
    }

    async sendMessage(channelId: string, message: Message) {
        const channelRef = collection(
            this.firestore.firestore,
            `channels/${channelId}/messages`,
        );
        const messagesSnapshot = await getDocs(channelRef);
        const messageCount = messagesSnapshot.size;
        const newMessageRef = doc(channelRef, this.padNumber(messageCount, 4));
        console.log(this.selectedPadnumber);
        const messageData: Message = {
            id: this.currentUser.currentUser.id,
            avatar: this.currentUser.currentUser.avatar,
            name: this.currentUser.currentUser.name,
            time: message.time,
            message: message.message,
            createdAt: serverTimestamp(),
            reactions: {},
            padNumber: this.selectedPadnumber,
            btnReactions: [],
            imageUrl: message.imageUrl
        };
        await setDoc(newMessageRef, messageData);
    }

    async sendThreadMessage(
        channelId: string,
        messageId: string,
        message: Message,
    ) {
        const threadRef = collection(
            this.firestore.firestore,
            `channels/${channelId}/messages/${messageId}/threads`,
        );
        const messagesSnapshot = await getDocs(threadRef);
        const messageCount = messagesSnapshot.size;
        const newMessageRef = doc(threadRef, this.padNumber(messageCount, 4));

        const messageData: Message = {
            id: this.currentUser.currentUser.id,
            avatar: this.currentUser.currentUser.avatar,
            name: this.currentUser.currentUser.name,
            time: message.time,
            message: message.message,
            createdAt: serverTimestamp(),
            reactions: {},
            padNumber: this.selectedPadnumber,
            btnReactions: [],
            imageUrl: message.imageUrl
        };
        console.log(messageData);
        await setDoc(newMessageRef, messageData);
    }

    padNumber(num: number, size: number) {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        this.selectedPadnumber = s;
        return s;
    }

    subUsersList() {
        let ref = this.firestore.usersRef;
        return onSnapshot(ref, (list) => {
            this.usersList = [];
            list.forEach((element) => {
                this.usersList.push(
                    this.setUsersListObj(element.data(), element.id),
                );
            });
        });
    }

    setUsersListObj(obj: any, id: string): UsersList {
        return {
            id: id || "",
            name: obj.name || "",
            avatar: obj.avatar || "",
            email: obj.email || "",
            online: obj.online || false,
        };
    }

    setComponent(componentName: string) {
        this.openComponent = componentName;
    }

    checkContext(context:string, chatMessagePadnr :string, currentMessagePadnr : string){
        
        switch (context) {
            
            case 'chat':
                this.collectionPath = `channels/${this.currentChannelID}/messages`;
                this.pathNr = chatMessagePadnr;
                break;
            case 'thread':
                this.collectionPath = `channels/${this.currentChannelID}/messages/${chatMessagePadnr}/threads`;
                this.pathNr= currentMessagePadnr;
                break;
            case 'DM':
                this.collectionPath = `users/${this.currentUser.currentUserUid}/${chatMessagePadnr}`;
                this.pathNr = currentMessagePadnr;
                break;
            default:
                console.error(`Unknown context: ${context}`);
                return;
        }
    }
    async addReaction(chatMessagePadnr: string, emoji: string, context: string, currentMessagePadnr: string) {
       this.checkContext(context,chatMessagePadnr, currentMessagePadnr);

        const threadMessagesRef = collection(this.firestore.firestore,this.collectionPath);
        const messageRef = doc(threadMessagesRef, this.pathNr);
        const messageSnapshot = await getDoc(messageRef);
        
        if (!messageSnapshot.exists()) {
            console.error(`Message with ID ${this.pathNr} not found`);
            return;
        }

        const messageData = messageSnapshot.data();
        console.log(messageData)
        if (!messageData["reactions"]) {
            messageData["reactions"] = {};
        }

        if (!messageData["reactions"][emoji]) {
            messageData["reactions"][emoji] = {
                count: 0,
                users: []
            };
        }

        const reaction = messageData['reactions'][emoji];
        const currentUserName = this.currentUser.currentUser.name;
        if (!reaction.users.includes(currentUserName)) {
            messageData["reactions"][emoji].count++;
            messageData["reactions"][emoji].users.push(this.currentUser.currentUser.name);
            await updateDoc(messageRef, { reactions: messageData["reactions"] });
        }
        
    }

    async addOrSubReaction(message: any, reaction: string, context :string, chatMessagePadnr : string) {
        if (context === 'DM') {
            this.checkContext(context, chatMessagePadnr,message)
        }else{
            this.checkContext(context, chatMessagePadnr,message.padNumber)
        }
        const threadMessagesRef = collection(this.firestore.firestore,this.collectionPath);
        const messageRef = doc(threadMessagesRef, this.pathNr);
        const messageSnapshot = await getDoc(messageRef);
        if (!messageSnapshot.exists()) {
            console.error(`Message with ID ${message.key} not found`);
            return;
        }
        const messageData = messageSnapshot.data();
        const currentUser = this.currentUser.currentUser.name;

        if (!messageData["reactions"]) {
            messageData["reactions"] = {
                count: 0,
                users: []
            };
        }

        const reactionData = messageData["reactions"][reaction];
        const userIndex = reactionData.users.indexOf(currentUser);

        if (userIndex === -1) {
            reactionData.users.push(currentUser);
            reactionData.count++;
        } 
        else {
            reactionData.users.splice(userIndex, 1);
            reactionData.count--;
            if (reactionData.count === 0) {
                delete messageData["reactions"][reaction];
            }
        }
        await updateDoc(messageRef, { reactions: messageData["reactions"] });
    }
}
