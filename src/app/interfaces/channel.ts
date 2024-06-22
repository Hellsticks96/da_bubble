import { Message } from "./message";
import { UsersList } from "./users-list";

export interface Channel {
    name: string;
    description: string;
    creator: string;
    members: UsersList[];
    messages?: Map<string, Message>;
}
