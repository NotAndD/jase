import { getRandomInt } from "../models/Character";

export const GAME_START_LOG = 'And the game begins..';

export class GameLogRepository {
    static logEntries: Record<string, Array<string>> = {};

    static loadLogEntries(templateEntries: Record<string, Array<string>>) {
        GameLogRepository.logEntries = templateEntries;
    }

    static getFirstLogEntryFor(logKey: string): string | undefined {
        if (!GameLogRepository.logEntries[logKey]) {
            return undefined;
        }

        return GameLogRepository.logEntries[logKey][0];
    }

    static getLogEntryFor(logKey: string): string | undefined {
        if (!GameLogRepository.logEntries[logKey]) {
            return undefined;
        }

        const possibilities = GameLogRepository.logEntries[logKey];
        const randomNumber = getRandomInt(0, possibilities.length - 1);

        return possibilities[randomNumber];
    }
}
