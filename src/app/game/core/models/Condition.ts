import { CharacterGender } from './Character';

export class Condition {
    id!: number;

    type!: ConditionType;

    difficulty!: number;

    requiredPGender!: CharacterGender;
    requiredOGender!: CharacterGender;

    requiredTags!: Array<string>;

    constructor(obj ?: any) {
        if (obj) {
            this.id = obj.id;
            this.type = obj.type;
            this.requiredPGender = obj.requiredPGender;
            this.requiredOGender = obj.requiredOGender;
            this.requiredTags = obj.requiredTags;
            this.difficulty = obj.difficulty;
        }
    }
}


export enum ConditionType {
    GENDER,
    TAGS,
    BEING_FAST,
    FATALITY,
    REQUIRE_TAGS
}
