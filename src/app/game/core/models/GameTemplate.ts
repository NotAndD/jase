import { CharacterPoll } from './Character';
import { Result } from './Result';
import { Condition } from './Condition';
import { Paragraph, toParagrapth } from './Paragraph';

export class GameTemplate {
    id!: string;
    name!: string;
    description!: string;

    player!: CharacterPoll;
    other!: CharacterPoll;

    results!: Array<Result>;
    conditions!: Array<Condition>;
    paragraphs!: Array<Paragraph>;

    messages!: Record<string, string>;
    pauseMessages!: Array<string>;
    musics!: string[];

    logEntries!: Record<string, Array<string>>;
    logTitle!: string;

    onConsoleOpened?: () => number;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id;
            this.name = obj.name;
            this.description = obj.description;

            this.player = new CharacterPoll(obj.player);
            this.other = new CharacterPoll(obj.other);

            this.results = buildResults(obj.results);
            this.conditions = buildConditions(obj.conditions);
            this.paragraphs = buildParagraphs(obj.paragraphs);

            this.messages = obj.messages;
            this.pauseMessages = obj.pauseMessages;
            this.musics = obj.musics;

            this.logEntries = obj.logEntries;
            this.logTitle = obj.logTitle;

            this.onConsoleOpened = obj.onConsoleOpened;
        }
    }
}

function buildResults(jsonResults: any): Array<Result> {
    if (!jsonResults || !jsonResults.length) {
        return [];
    }
    const results: Array<Result> = [];

    for (let i = 0; i < jsonResults.length; i++) {
        results.push(new Result(jsonResults[i]));
    }

    return results;
}

function buildConditions(jsonConditions: any): Array<Condition> {
    if (!jsonConditions || !jsonConditions.length) {
        return [];
    }
    const results: Array<Condition> = [];

    for (let i = 0; i < jsonConditions.length; i++) {
        results.push(new Condition(jsonConditions[i]));
    }

    return results;
}

function buildParagraphs(jsonParagraphs: any): Array<Paragraph> {
    if (!jsonParagraphs || !jsonParagraphs.length) {
        return [];
    }
    const results: Array<Paragraph> = [];

    for (let i = 0; i < jsonParagraphs.length; i++) {
        results.push(toParagrapth(jsonParagraphs[i]));
    }

    return results;
}
