import { Character, getRandomInt } from '../models/Character';
import { Game } from '../models/Game';
import { MessageParagraph } from '../models/MessageParagraph';
import { Paragraph } from '../models/Paragraph';
import { Player } from '../models/Player';
import { ParagraphRepository } from '../repositories/ParagraphRepository';
import { TUTORIAL_OBSCURE } from '../repositories/TutorialRepository';
import { TutorialService } from './TutorialService';

export const INNER_EXTERNAL_SEPARATOR = '|_|-|';
export const INNER_INTERNAL_SEPARATOR = ':_:-:';

export class ParagraphService {
    private game!: Game;
    private player!: Player;
    private other!: Character;

    setup(g: Game) {
        this.game = g;
        this.player = g.player;
        this.other = g.other;
    }

    getParagraphText(paragraph: Paragraph) {
        let text = paragraph.text;
        text = getParagraphCompiledText(text, this.player.character, this.other);
        text = this.handleTags(text);
        return this.handleInnerParagraphs(text, paragraph);
    }

    paragraphToMessage(paragraph: Paragraph): MessageParagraph {
        const result: MessageParagraph = {
            id: paragraph.id,
            title: paragraph.title,
            text: this.getParagraphText(paragraph),
            author: paragraph.author,
            innerSons: paragraph.innerSons
        };

        return result;
    }

    private handleInnerParagraphs(text: string, paragraph: Paragraph): string {
        if (paragraph.innerSons) {
            const innerSons = ParagraphRepository.multiGet(paragraph.innerSons);
            innerSons.forEach(son => {
                text = innerPassage(text, son.title, son.id);
            });
        }
        // inners not linked are simply removed from game
        text = removeRemainingInnersPassage(text);

        return text;
    }

    private handleTags(text: string): string {
        text = obscuredPassage(text, !this.player.hasTag('see_obscure'), this.game);

        return text;
    }
}

export function getParagraphCompiledText(t: string, p: Character, o: Character) {
    t = genderPassage(t, p, o);
    t = shortDescPassage(t, p, o);
    t = fullDescPassage(t, p, o);
    t = namePassage(t, p, o);

    return t;
}

function obscuredPassage(t: string, obscure: boolean, g: Game): string {
    if (t.indexOf('[obscure]') === -1) {
        return t;
    }

    const findObscure = new RegExp(/\[obscure\][a-zA-Z0-9 \'\-\?\,\.\:\!]*\[\/obscure\]/, 'g');
    let matches = t.match(findObscure);
    if (matches) {
        matches.forEach(match => {
            let handledMatch = match.replace('[obscure]', '').replace('[/obscure]', '');
            if (obscure) {
                handledMatch = givenObscuredString(handledMatch);
                TutorialService.trigger(TUTORIAL_OBSCURE, g);
            }
            t = t.replace(match, handledMatch);
        });
    }

    return t;
}

function givenObscuredString(original: string): string {
    const obscureAlphabet = '+<>°±♫þ○▲¿☼○♪•■·Þ';
    const result = [];
    for (let i = 0; i < original.length; i++) {
        const char = original.charAt(i);
        result.push(isLetter(char) || isNumeric(char)
            ? obscureAlphabet[getRandomInt(0, obscureAlphabet.length - 1)]
            : char);
    }
    return result.join('');
}

function isLetter(c: string): boolean {
    return c.toLowerCase() != c.toUpperCase();
}

function isNumeric(c: string): boolean {
    return c !== ' ' && !isNaN(+c);
}

function innerPassage(t: string, from: string, to: number) {
    const substitution = new RegExp( /\[inner=/.source + from + /\]/.source);
    t = replaceAll(t, substitution, INNER_EXTERNAL_SEPARATOR + from
        + INNER_INTERNAL_SEPARATOR + to + INNER_EXTERNAL_SEPARATOR);

    return t;
}

function removeRemainingInnersPassage(t: string) {
    t = replaceAll(t, /\[inner=.*\]/, '');

    return t;
}

function genderPassage(t: string, p: Character, o: Character) {
    t = replaceAll(t, /\[p_he_she\]/, p.isMale() ? 'he' : 'she');
    t = replaceAll(t, /\[p_his_her\]/, p.isMale() ? 'his' : 'her');
    t = replaceAll(t, /\[p_him_her\]/, p.isMale() ? 'him' : 'her');
    t = replaceAll(t, /\[p_his_hers\]/, p.isMale() ? 'his' : 'hers');
    t = replaceAll(t, /\[p_boy_girl\]/, p.isMale() ? 'boy' : 'girl');

    t = replaceAll(t, /\[o_he_she\]/, o.isMale() ? 'he' : 'she');
    t = replaceAll(t, /\[o_his_her\]/, o.isMale() ? 'his' : 'her');
    t = replaceAll(t, /\[o_him_her\]/, o.isMale() ? 'him' : 'her');
    t = replaceAll(t, /\[o_his_hers\]/, o.isMale() ? 'his' : 'hers');
    t = replaceAll(t, /\[o_boy_girl\]/, o.isMale() ? 'boy' : 'girl');

    return t;
}

function fullDescPassage(t: string, p: Character, o: Character) {
    t = replaceAll(t, /\[p_full_desc\]/, p.fullDesc);
    t = replaceAll(t, /\[o_full_desc\]/, o.fullDesc);

    return t;
}

function shortDescPassage(t: string, p: Character, o: Character) {
    t = replaceAll(t, /\[p_short_desc\]/, () =>
        p.getRandomShortDesc());
    t = replaceAll(t, /\[o_short_desc\]/, () =>
        o.getRandomShortDesc());

    t = replaceAll(t, /\[p_off_desc\]/, () =>
        p.getRandomOffensiveDesc());
    t = replaceAll(t, /\[o_off_desc\]/, () =>
        o.getRandomOffensiveDesc());

    return t;
}

function namePassage(t: string, p: Character, o: Character) {
    t = replaceAll(t, /\[p_name\]/, p.name);
    t = replaceAll(t, /\[o_name\]/, o.name);

    return t;
}

function replaceAll(target: string, search: RegExp, replacement: any) {
    return target.replace(new RegExp(search, 'g'), replacement);
}
