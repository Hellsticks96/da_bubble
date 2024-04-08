import { Message } from "./message";

export interface Channel {
    members: string[],
    messages?: Map<string, Message>
}
