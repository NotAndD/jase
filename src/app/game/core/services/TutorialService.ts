import { Game } from '../models/Game';
import { TutorialRepository } from '../repositories/TutorialRepository';
import { OptionRepository, OPTION_TUTORIAL } from '../repositories/OptionRepository';

export const STORAGE_TUTORIAL = 'game_tutorial';

export class TutorialService {
    static sawMap: Record<string, boolean> = {};

    static load() {
        if (window.localStorage && localStorage.getItem(STORAGE_TUTORIAL)) {
            TutorialService.sawMap = JSON.parse(localStorage.getItem(STORAGE_TUTORIAL) as string);
            return true;
        }
        return false;
    }

    static delete() {
        if (window.localStorage && localStorage.getItem(STORAGE_TUTORIAL)) {
            localStorage.removeItem(STORAGE_TUTORIAL);
        }
        TutorialService.sawMap = {};
    }

    static save() {
        if (window.localStorage) {
            localStorage.setItem(STORAGE_TUTORIAL, JSON.stringify(TutorialService.sawMap));
        }
    }

    static trigger(key: string, g: Game) {
        if (OptionRepository.getOption(OPTION_TUTORIAL) && !TutorialService.sawMap[key]) {
            const messages = TutorialRepository.get(key);
            if (messages) {
                for (let i = messages.length -1; i >= 0; i--) {
                    g.playerMessages.push(messages[i]);
                }
                TutorialService.sawMap[key] = true;
                TutorialService.save();
            }
        }
    }
}
