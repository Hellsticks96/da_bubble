export interface Message {
    avatar: string,
    name: string,
    time: string,
    message: string,
    createdAt: any,
    reactions?: { [key: string]: number } //Map<string, number>
}
