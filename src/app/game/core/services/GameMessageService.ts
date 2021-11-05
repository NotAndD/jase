import { getRandomInt } from '../models/Character';

export class GameMessageService {
    static pauseMessages: Array<string> = [];
    static messages: Record<string, string> = {};

    static loadMessages(messages: Record<string, string>,
        pauseMessages: Array<string>) {
        GameMessageService.pauseMessages = pauseMessages;
        GameMessageService.messages = messages;
    }

    static getRandomPauseMessage(): string {
        const j = getRandomInt(0, GameMessageService.pauseMessages.length - 1);
        return GameMessageService.pauseMessages[j];
    }

    static getMessage(key: string): string {
        return GameMessageService.messages[key];
    }
}
