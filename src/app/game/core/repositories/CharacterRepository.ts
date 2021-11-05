import { Character, CharacterGender, getRandomInt, CharacterPoll } from '../models/Character';

const emptyChar = new Character({
    id: 0,
    name: '',
    gender: CharacterGender.MALE,
    fullDesc: '',
    shortDesc: new Array(''),
    offensiveDesc: new Array('')
});

export class CharacterRepository {

    static characters: Array<CharacterPoll> = [];

    static emptyChar = emptyChar;

    static loadCharacter(characters: Array<CharacterPoll>) {
        CharacterRepository.characters = characters;
    }

    static getRandom(pollName: string, id ?: number) {
        const poll = CharacterRepository.characters.filter(poll => poll.name === pollName);
        return CharacterRepository.getRandomChar(poll[0].characters, id);
    }

    static getRandomChar(chars: any, id ?: number): Character {
        let result!: Character;
        for (let i = 0; i < 10; i++) {
            const randomNumber = getRandomInt(0, chars.length - 1);
            result = chars[randomNumber];
            if (result.id !== id) {
                return result;
            }
        }
        return result;
    }

    static getEmptyChar() {
        return emptyChar;
    }
}
