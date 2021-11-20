import { Game } from '../models/Game';
import { GameSlot } from '../models/GameSlot';
import { GameTemplate } from '../models/GameTemplate';
import { Statistics } from '../models/Statistics';

const STORAGE_GAME = 'game_entity_';
const STORAGE_GAME_SLOT = 'game_slot_';
const STORAGE_STATISTICS = 'game_statistics_';
const STORAGE_GAME_TEMPLATES_LIST = 'game_template_lists';
const STORAGE_GAME_TEMPLATE = 'game_template_';
const VERSION = '0.6'

const MAX_GAME_SLOTS = 3;

export class StorageService {

    isLocalStorageAvailable(): boolean {
        return window.localStorage && localStorage && localStorage.getItem !== undefined;
    }

    getLocalTemplateNames(): string[] {
        const localTemplateNames = localStorage.getItem(STORAGE_GAME_TEMPLATES_LIST);
        if (!localTemplateNames) {
            return [];
        }

        const localTemplates = JSON.parse(localTemplateNames);
        const result: string[] = [];
        for (let i = 0; i < localTemplates.length; i++) {
            result.push(localTemplates[i]);
        }

        return result;
    }

    getLocalTemplate(templateId: string): GameTemplate | undefined {
        const storageTemplate = localStorage.getItem(STORAGE_GAME_TEMPLATE + templateId);
        if (!storageTemplate) {
            return undefined;
        }

        return new GameTemplate(JSON.parse(storageTemplate));
    }

    saveTemplate(template: GameTemplate) {
        const localTemplateNames = this.getLocalTemplateNames();
        if (localTemplateNames.indexOf(template.id) === -1) {
            localTemplateNames.push(template.id);
            localStorage.setItem(STORAGE_GAME_TEMPLATES_LIST, JSON.stringify(localTemplateNames));
        }
        localStorage.setItem(STORAGE_GAME_TEMPLATE + template.id, JSON.stringify(template));
    }

    getLocalTemplates(): GameTemplate[] {
        const localTemplateNames = this.getLocalTemplateNames();
        const result: GameTemplate[] = [];

        localTemplateNames.forEach(name => {
            const possibleTemplate = this.getLocalTemplate(name);
            if (possibleTemplate) {
                result.push(possibleTemplate);
            }
        });

        return result;
    }

    getGameSlots(templateId: string): GameSlot[] {
        const result = [];
        for (let i = 1; i <= MAX_GAME_SLOTS; i++) {
            result.push(this.getGameSlot(templateId, i));
        }

        return result;
    }

    getGameSlot(templateId: string, slot: number): GameSlot {
        const storageSlot = localStorage.getItem(STORAGE_GAME_SLOT + slot + '_' + templateId);
        return new GameSlot(templateId, slot, storageSlot ? JSON.parse(storageSlot) : undefined);
    }

    loadGame(templateId: string, slot: number, fromStart?: boolean) {
        const localGame = localStorage.getItem(STORAGE_GAME + slot + '_' + templateId);
        return new Game(localGame ? JSON.parse(localGame) : undefined, fromStart);
    }

    getLocalGame(templateId: string, slot: number) {
        return localStorage.getItem(STORAGE_GAME + slot + '_' + templateId);
    }

    importGame(templateId: string, slot: number, gameText: string) {
        const game = new Game(JSON.parse(gameText));
        if (!game.slot || game.slot.templateId !== templateId) {
            throw new TypeError('The game is not of the appropriate type');
        }
        game.slot.slot = slot;
        this.saveGame(game);
        this.saveSlot(game.slot);
    }

    saveGame(game: Game) {
        if (window.localStorage) {
            localStorage.setItem(STORAGE_GAME + game.slot.slot + '_' + game.slot.templateId,
                JSON.stringify(game));
        }
    }

    saveSlot(slot: GameSlot) {
        if (window.localStorage) {
            localStorage.setItem(STORAGE_GAME_SLOT + slot.slot + '_' + slot.templateId,
                JSON.stringify(slot));
        }
    }

    purgeSlot(templateId: string, slot: number) {
        if (window.localStorage) {
            localStorage.removeItem(STORAGE_GAME + slot + '_' + templateId);
            localStorage.removeItem(STORAGE_GAME_SLOT + slot + '_' + templateId);
        }
    }

    loadStatistics(templateId: string): Statistics {
        const statistics = localStorage.getItem(STORAGE_STATISTICS + templateId);
        const result = new Statistics(statistics ? JSON.parse(statistics) : undefined);
        result.templateId = templateId;
        result.version = VERSION;

        return result;
    }

    saveStatistics(statistics: Statistics) {
        if (window.localStorage) {
            localStorage.setItem(STORAGE_STATISTICS + statistics.templateId,
                JSON.stringify(statistics));
        }
    }

}

// there's a single, static, StorageHandler.. to simplify a global handling of the localStorage
export class StorageHandler {
    static storageService = new StorageService();
}
