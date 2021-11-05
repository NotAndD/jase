import { EXAMPLE_GAME } from '../example/template';
import { getRandomInt } from '../models/Character';
import { GameTemplate } from '../models/GameTemplate';
import { StorageHandler } from '../services/StorageService';

const POSSIBLE_TEMPLATE_ID_PIECES_1 = ['majestic', 'explosive', 'incredible', 'sad', 'hungry', 'angry', 'shy',
    'smug', 'overpowered', 'trembling', 'annoying', 'playful', 'apatic', 'optimistic', 'pessimistic', 'raging',
    'heroical', 'powerful', 'weak', 'happy', 'zen', 'overconfident', 'calm', 'energetic', 'pure', 'corrupted'];
const POSSIBLE_TEMPLATE_ID_PIECES_2 = ['dog', 'kitty', 'pup', 'bear', 'wolf', 'dragon', 'horse', 'shark', 'unicorn',
    'fox', 'chicken', 'tiger', 'lion', 'pig', 'mouse', 'hawk', 'crocodile', 'elephant', 'panther', 'tuna', 'salmon',
    'human', 'ant', 'spider', 'snake', 'lizard', 'eagle', 'robin', 'frog', 'bee', 'armadillo', 'scorpion'];
const POSSIBLE_TEMPLATE_ID_PIECES_3 = ['run', 'jump', 'fly', 'explode', 'harvest', 'cry', 'laugh', 'fight',
    'read', 'write', 'drink', 'eat', 'rest', 'sleep', 'sing', 'blink', 'walk', 'yawn', 'roll', 'fall', 'leave',
    'grin', 'smile', 'smirk',' shift', 'sigh', 'grunt', 'flicker', 'teleport', 'chuckle', 'facepalm'];

export class GameTemplateRepository {

    static templates: Array<GameTemplate> = [];
    static init = false;

    static getRandomTemplateId(): string {
        return POSSIBLE_TEMPLATE_ID_PIECES_1[getRandomInt(0, POSSIBLE_TEMPLATE_ID_PIECES_1.length)]
            + '-' + POSSIBLE_TEMPLATE_ID_PIECES_2[getRandomInt(0, POSSIBLE_TEMPLATE_ID_PIECES_2.length)]
            + '-' + POSSIBLE_TEMPLATE_ID_PIECES_3[getRandomInt(0, POSSIBLE_TEMPLATE_ID_PIECES_3.length)];
    }

    static downloadTemplate(templateId: string) {
        // TODO download template, then put it in the available templates
    }

    static list(): GameTemplate[] {
        if (!GameTemplateRepository.init) {
            GameTemplateRepository.templates = StorageHandler.storageService.getLocalTemplates();
            GameTemplateRepository.templates.push(EXAMPLE_GAME);
            GameTemplateRepository.init = true;
        }

        return GameTemplateRepository.templates;
    }

    static add(template: GameTemplate) {
        GameTemplateRepository.templates.push(template);
    }

    static get(id: string) {
        const result = GameTemplateRepository.templates.filter(t => t.id === id);

        return result[0];
    }
}

/* add templates here to have them available in repos */
