import { GameTemplate } from "../models/GameTemplate";
import { ANTAGONIST_CHARS, PROTAGONIST_CHARS } from "./characters";
import { CONDITIONS } from "./conditions";
import { LOG_ENTRIES, LOG_TITLE } from "./log";
import { MESSAGES, MUSICS, PAUSE_MESSAGES } from "./misc";
import { PARAGRAPHS } from "./paragraphs";
import { RESULTS } from "./results";

export const EXAMPLE_GAME: GameTemplate = new GameTemplate({
    id: 'the-example-story',
    name: 'The Example Story',
    description: 'Just an example story which can be played and edited by everyone (locally) to test around JASE functionalities',

    player: PROTAGONIST_CHARS,
    other: ANTAGONIST_CHARS,

    results: RESULTS,
    conditions: CONDITIONS,
    paragraphs: PARAGRAPHS,

    messages: MESSAGES,
    pauseMessages: PAUSE_MESSAGES,
    musics: MUSICS,

    logEntries: LOG_ENTRIES,
    logTitle: LOG_TITLE
});
