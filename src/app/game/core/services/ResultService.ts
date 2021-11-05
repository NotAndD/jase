import { Game } from '../models/Game';
import { ResultRepository } from '../repositories/ResultRepository';
import { ResultType, Result } from '../models/Result';
import { TutorialService } from './TutorialService';
import { AudioHandler } from './AudioService';
import { getRandomInt } from '../models/Character';
import { GameMessageService } from './GameMessageService';
import { TUTORIAL_PAR_AVAILABLE } from '../repositories/TutorialRepository';
import { GameLogRepository } from '../repositories/GameLogRepository';
import { getParagraphCompiledText } from './ParagraphService';
import { StatisticsHandler } from './StatisticsService';

export class ResultService {

    cleanUp(g: Game) {
        g.isShaking = false;
    }

    applyAll(ids: Array<number> | undefined, g: Game) {
        if (ids && ids.length > 0) {
            ids.forEach(id => {
                this.apply(id, g);
            });
        }
    }

    isTrueEnding(id: number, g: Game): boolean {
        const result = ResultRepository.get(id);
        if (!result) {
            return false;
        }

        return result.type === ResultType.GAME_TRUE_END;
    }

    apply(id: number, g: Game) {
        const result = ResultRepository.get(id);
        if (!result) {
            return;
        }

        if (result.type === ResultType.GAME_END) {
            g.isGameOver = true;
        } else if (result.type === ResultType.GAME_TRUE_END) {
            g.isTrueGameOver = true;
            g.isGameOver = true;
        } else if (result.type === ResultType.REWIND_DISABLED) {
            g.isRewindAvailable = false;
        } else if (result.type === ResultType.PLAYER_TAG) {
            this.applyTagResult(result, g);
        } else if (result.type === ResultType.SOUND_EFFECT) {
            this.appySoundEffectResult(result);
        } else if (result.type === ResultType.SHAKE) {
            g.isShaking = true;
        } else if (result.type === ResultType.PAR_AVAILABLE) {
            if (g.additionalPars.indexOf(result.paragraphId) === -1) {
                TutorialService.trigger(TUTORIAL_PAR_AVAILABLE, g);
                g.additionalPars.push(result.paragraphId);
            }
        } else if (result.type === ResultType.ADD_TO_LOG) {
            this.applyLogEntry(result, g);
        }
    }

    mayAnyUnlockNewPaths(ids: Array<number> | undefined, g: Game): boolean {
        if (!ids || ids.length === 0) {
            return false;
        }

        return ids.filter(id => this.mayUnlockNewPaths(id, g)).length > 0;
    }

    mayUnlockNewPaths(id: number, g: Game): boolean {
        const result = ResultRepository.get(id);
        if (!result) {
            return false;
        }

        return result.type === ResultType.PLAYER_TAG && result.tagsToAdd
            && !g.player.hasTags(result.tagsToAdd);
    }

    applyLogEntry(result: Result, g: Game) {
        const logEntry = GameLogRepository.getLogEntryFor(result.logEntry);
        if (!logEntry) {
            return;
        }

        g.log.push(getParagraphCompiledText(logEntry, g.player.character, g.other));
        const firstLogEntry = GameLogRepository.getFirstLogEntryFor(result.logEntry) as string;
        StatisticsHandler.statisticsService.onNewEntry(
            getParagraphCompiledText(firstLogEntry, g.player.character, g.other));
    }

    appySoundEffectResult(result: Result) {
        const randomSound = result.soundIds[getRandomInt(0, result.soundIds.length - 1)];
        AudioHandler.audioService.playAudioEffect(randomSound);
    }

    applyTagResult(result: Result, g: Game) {
        if (result.tagsToAdd) {
            result.tagsToAdd.forEach(tag => {
                if (g.player.pushTag(tag)) {
                    const tagMessage = GameMessageService.getMessage(tag);
                    if (tagMessage) {
                        g.playerMessages.push(tagMessage);
                        g.log.push(tagMessage);
                    }
                }
            });
        }

        // still unused, probably needs to be improved
        if (result.tagsToRemove) {
            result.tagsToRemove.forEach(tag => {
                g.player.removeTag(tag);
            });
        }
    }

    revertAll(ids: Array<number> | undefined, g: Game) {
        if (ids && ids.length > 0) {
            ids.forEach(id => {
                this.revert(id, g);
            });
        }
    }

    revert(id: number, g: Game) {
        const result = ResultRepository.get(id);
        if (!result) {
            return;
        }

        if (result.type === ResultType.GAME_END) {
            g.isGameOver = false;
        } else if (result.type === ResultType.REWIND_DISABLED) {
            g.isRewindAvailable = true;
        }
    }
}
