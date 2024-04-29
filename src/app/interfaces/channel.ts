import { Message } from "./message";
import { UsersList } from "./users-list";

export interface Channel {
    description: string,
    members: UsersList[],
    messages?: Map<string, Message>
}
