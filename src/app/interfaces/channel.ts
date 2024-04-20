import { Message } from "./message";

export interface Channel {
    description: string,
    members: string[],
    messages?: Map<string, Message>
}
