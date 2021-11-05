import { Condition, ConditionType } from '../models/Condition';


export class ConditionRepository {
    static conditions: Array<Condition> = [];
    static lastIdUsed = -1;

    static loadConditions(conditions: Array<Condition>) {
        ConditionRepository.conditions = [];
        ConditionRepository.lastIdUsed = -1;
        conditions.forEach(c => {
            ConditionRepository.conditions.push(c);
            ConditionRepository.lastIdUsed += 1;
        });
    }

    static addCondition(condition: Condition) {
        ConditionRepository.lastIdUsed += 1;
        condition.id = ConditionRepository.lastIdUsed;
        ConditionRepository.conditions.push(condition);

        return ConditionRepository.conditions[ConditionRepository.lastIdUsed];
    }

    static get(id: number): Condition {
        return ConditionRepository.conditions[id];
    }

    static getBest(obj: any) {
        if (obj.type === ConditionType.GENDER) {
            return ConditionRepository.getBestGenderOne(obj);
        } else if (obj.type === ConditionType.BEING_FAST) {
            return ConditionRepository.conditions[0];
        } else if (obj.type === ConditionType.FATALITY) {
            return ConditionRepository.getBestFatalityOne(obj);
        } else if (obj.type === ConditionType.REQUIRE_TAGS) {
            return ConditionRepository.getBestRequiredTagsOne(obj);
        }

        // unknown type of condition for this engine
        return undefined;
    }

    static getBestRequiredTagsOne(obj: any) {
        const result = ConditionRepository.conditions
            .filter(c => c.type === ConditionType.REQUIRE_TAGS)
            .filter(c => areArraysEquals(c.requiredTags, obj.requiredTags));

        if (!result || result.length !== 1) {
            return ConditionRepository.addCondition(new Condition({
                type: ConditionType.REQUIRE_TAGS,
                requiredTags: obj.requiredTags
            }));
        }
        return result[0];
    }

    static getBestFatalityOne(obj: any) {
        const result = ConditionRepository.conditions
            .filter(c => c.type === ConditionType.FATALITY)
            .filter(c => c.difficulty === obj.difficulty);

        return result[0];
    }

    static getBestGenderOne(obj: any) {
        const result = ConditionRepository.conditions
            .filter(c => c.type === ConditionType.GENDER)
            .filter(c => (!obj.requiredPGender && c.requiredPGender === undefined)
                || (obj.requiredPGender && obj.pGender === c.requiredPGender))
            .filter(c => (!obj.requiredOGender && c.requiredOGender === undefined)
                || (obj.requiredOGender && obj.oGender === c.requiredOGender));

        return result[0];
    }
}

function areArraysEquals(first: Array<string>, second: Array<string>) {
    if (!first || !second || first.length !== second.length) {
        return false;
    }
    return first.filter(f => second.find(s => s === f)).length === first.length;
}
