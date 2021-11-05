import { Condition, ConditionType } from '../models/Condition';
import { CharacterGender } from '../models/Character';

const beingFast =  new Condition({
    id: 0,
    type: ConditionType.BEING_FAST
});
const isBothMale = new Condition({
    id: 1,
    type: ConditionType.GENDER,
    requiredPGender: CharacterGender.MALE,
    requiredOGender: CharacterGender.MALE
});
const isBothFemale = new Condition({
    id: 2,
    type: ConditionType.GENDER,
    requiredPGender: CharacterGender.FEMALE,
    requiredOGender: CharacterGender.FEMALE
});
const pIsMaleOIsFemale = new Condition({
    id: 3,
    type: ConditionType.GENDER,
    requiredPGender: CharacterGender.MALE,
    requiredOGender: CharacterGender.FEMALE
});
const pIsMale = new Condition({
    id: 4,
    type: ConditionType.GENDER,
    requiredPGender: CharacterGender.MALE
});
const pIsFemale = new Condition({
    id: 5,
    type: ConditionType.GENDER,
    requiredPGender: CharacterGender.FEMALE
});
const pIsFemaleOIsMale = new Condition({
    id: 6,
    type: ConditionType.GENDER,
    requiredPGender: CharacterGender.FEMALE,
    requiredOGender: CharacterGender.MALE
});
const oIsMale = new Condition({
    id: 7,
    type: ConditionType.GENDER,
    requiredOGender: CharacterGender.MALE
});
const oIsFemale = new Condition({
    id: 8,
    type: ConditionType.GENDER,
    requiredOGender: CharacterGender.FEMALE
});
const fatalityEasy = new Condition({
    id: 9,
    type: ConditionType.FATALITY,
    difficulty: 0
});
const fatalityHard = new Condition({
    id: 10,
    type: ConditionType.FATALITY,
    difficulty: 1
});
const fatalityImpossible = new Condition({
    id: 11,
    type: ConditionType.FATALITY,
    difficulty: 2
});

export const CONDITIONS = [beingFast, isBothMale, isBothFemale, pIsMaleOIsFemale, pIsMale,
    pIsFemale, pIsFemaleOIsMale, oIsMale, oIsFemale, fatalityEasy, fatalityHard,
    fatalityImpossible];
