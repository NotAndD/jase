export enum CharacterGender {
    MALE,
    FEMALE
}

export const STRING_CHARACTER_GENDER = [
    'Male', 'Female'
];

export class CharacterPoll {
    name!: string;
    description!: string;
    characters!: Array<Character>;

    constructor(obj?: any) {
        if (obj) {
            this.name = obj.name;
            this.description = obj.description;
            this.characters = obj.characters;
        }
    }
}

export class Character {
    id!: number;

    name!: string;
    gender!: CharacterGender;
    fullDesc!: string;
    shortDesc!: Array<string>;
    offensiveDesc!: Array<string>;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id;
            this.name = obj.name;
            this.gender = obj.gender;
            this.fullDesc = obj.fullDesc;
            this.shortDesc = obj.shortDesc;
            this.offensiveDesc = obj.offensiveDesc;
        }
    }

    setGender(s: string) {
        if (s === 'Male') {
            this.gender = CharacterGender.MALE;
        } else {
            this.gender = CharacterGender.FEMALE;
        }
    }

    getGender() {
        if (this.gender === CharacterGender.MALE) {
            return STRING_CHARACTER_GENDER[0];
        }
        return STRING_CHARACTER_GENDER[1];
    }

    isMale() {
        return this.gender === CharacterGender.MALE;
    }

    getRandomShortDesc() {
        const i = getRandomInt(0, this.shortDesc.length - 1);
        return this.shortDesc[i];
    }

    getRandomOffensiveDesc() {
        const i = getRandomInt(0, this.offensiveDesc.length - 1);
        return this.offensiveDesc[i];
    }
}

export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
