export interface SearchResult {
    type: "user" | "channel";
    id: string;
    name: string;
    avatar: string;
    message: string;
    userID?: string;
    channelName?: string;
    channelID?: string;
}
