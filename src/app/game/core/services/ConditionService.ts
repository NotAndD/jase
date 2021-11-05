import { Game } from '../models/Game';
import { ConditionRepository } from '../repositories/ConditionRepository';
import { Condition, ConditionType } from '../models/Condition';
import { getRandomInt } from '../models/Character';
import { TutorialService } from './TutorialService';
import { TUTORIAL_CONDITION, TUTORIAL_IMPOSSIBLE_CONDITION } from '../repositories/TutorialRepository';
import { OptionRepository, OPTION_CONDITION,
    OPTION_ENABLE_IMPOSSIBLE_CODITION } from '../repositories/OptionRepository';

export class ConditionService {

    static requireHandlingCondition(id: number) {
        const areConditionEnabled = OptionRepository.getOption(OPTION_CONDITION);
        const condition = ConditionRepository.get(id);
        return areConditionEnabled && condition.type === ConditionType.FATALITY;
    }

    static getSettlingId(parId: number, conditionId: number) {
        if (conditionId === undefined) {
            return parId + '_unknown';
        }
        return parId + '_' + conditionId;
    }

    // check if a condition is respected. If the condition requires
    // interactions, it prepares the interaction instead
    isRespected(parId: number, id: number, g: Game) {
        const condition = ConditionRepository.get(id);
        if (condition === undefined) {
            return true;
        }

        if (condition.type === ConditionType.GENDER) {
            return this.checkGenderCondition(condition, g);
        } else if (condition.type === ConditionType.BEING_FAST) {
            return this.applyFastCondition(parId, condition, g);
        } else if (condition.type === ConditionType.FATALITY) {
            return this.applyFatalityCondition(parId, condition, g);
        } else if (condition.type === ConditionType.REQUIRE_TAGS) {
            return this.checkRequireTagsCondition(condition, g);
        }

        return true;
    }

    // simply check if the condition is visible or not
    // without preparing any interaction
    isConditionVisible(id: number, g: Game) {
        const condition = ConditionRepository.get(id);
        if (condition === undefined) {
            return true;
        }
        if (condition.type === ConditionType.GENDER) {
            return this.checkGenderCondition(condition, g);
        } else if (condition.type === ConditionType.REQUIRE_TAGS) {
            return this.checkRequireTagsCondition(condition, g);
        } else if (condition.type === ConditionType.FATALITY) {
            return this.checkImpossibleFatalityCondition(condition);
        }

        return true;
    }

    isImpossible(id: number, g: Game) {
        const condition = ConditionRepository.get(id);
        return condition && condition.type === ConditionType.FATALITY && condition.difficulty === 2;
    }

    private checkRequireTagsCondition(c: Condition, g: Game) {
        return g.player.hasTags(c.requiredTags);
    }

    private checkImpossibleFatalityCondition(c: Condition) {
        return c.difficulty !== 2 || OptionRepository.getOption(OPTION_ENABLE_IMPOSSIBLE_CODITION);
    }

    private applyFatalityCondition(parId: number, c: Condition, g: Game) {
        if (c.difficulty === 2 && !OptionRepository.getOption(OPTION_ENABLE_IMPOSSIBLE_CODITION)) {
            return false;
        }
        if (!OptionRepository.getOption(OPTION_CONDITION)) {
            return true;
        }

        const settlingId = ConditionService.getSettlingId(parId, c.id);
        if (!g.conditionsSettling.has(settlingId)) {
            g.conditionsSettling.set(settlingId, true);
        }
        TutorialService.trigger(TUTORIAL_CONDITION, g);
        if (c.difficulty === 2) {
            TutorialService.trigger(TUTORIAL_IMPOSSIBLE_CONDITION, g);
        }

        return g.conditionsSettling.get(settlingId);
    }

    private applyFastCondition(parId: number, c: Condition, g: Game) {
        if (!OptionRepository.getOption(OPTION_CONDITION)) {
            return true;
        }

        const settlingId = ConditionService.getSettlingId(parId, c.id);
        if (!g.conditionsSettling.has(settlingId)) {
            const currentTurn = g.turn;
            const randomTimeout = getRandomInt(4000, 10000);
            g.conditionsSettling.set(settlingId, true);
            setTimeout(() => {
                if (currentTurn === g.turn) {
                    g.conditionsSettling.set(settlingId, false);
                }
            }, randomTimeout);
        }
        TutorialService.trigger(TUTORIAL_CONDITION, g);

        return g.conditionsSettling.get(settlingId);
    }

    private checkGenderCondition(c: Condition, g: Game) {
        let result = true;
        if (c.requiredOGender !== undefined) {
            result = result && c.requiredOGender === g.other.gender;
        }
        if (c.requiredPGender !== undefined) {
            result = result && c.requiredPGender === g.player.character.gender;
        }

        return result;
    }
}
