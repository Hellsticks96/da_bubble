export interface Message {
    avatar: string,
    name: string,
    time: string,
    message: string,
    reactions?: Map<string, number>
}
