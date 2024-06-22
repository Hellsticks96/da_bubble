export interface NewMessageOption {
    type: "user" | "channel";
    id: string;
    name: string;
    email?: string;
    avatar?: string; // Optional, nur für Benutzer relevant
}
