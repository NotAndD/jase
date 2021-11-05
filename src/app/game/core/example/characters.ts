import { Character, CharacterGender, CharacterPoll } from "../models/Character";

const bob = new Character({
    id: 1,
    name: 'Bob',
    gender: CharacterGender.MALE,
    fullDesc: 'tall and slender guy which really desires to buy apples.. but unfortunately misses the money for it',
    shortDesc: new Array('tall guy', 'guy'),
    offensiveDesc: new Array('poor man', 'poor guy')
});
const alice = new Character({
    id: 2,
    name: 'Alice',
    gender: CharacterGender.FEMALE,
    fullDesc: 'short and shy girl which really desires to buy apples.. but unfortunately misses the money for it',
    shortDesc: new Array('short girl', 'girl'),
    offensiveDesc: new Array('poor girl')
});

const sarah = new Character({
    id: 3,
    name: 'Sarah',
    gender: CharacterGender.FEMALE,
    fullDesc: 'mysterious woman with a mask on her face.. who knows what are her intentions',
    shortDesc: new Array('mysterious woman', 'masked woman'),
    offensiveDesc: new Array('blackmailer', 'usurer')
});
const jack = new Character({
    id: 4,
    name: 'Jack',
    gender: CharacterGender.MALE,
    fullDesc: 'mysterious man with a mask on his face.. who knows what are his intentions',
    shortDesc: new Array('mysterious man', 'masked guy', 'masked man'),
    offensiveDesc: new Array('blackmailer', 'usurer')
});

export const PROTAGONIST_CHARS = new CharacterPoll({
    name: 'Protagonist',
    description: 'The Protagonist of the story',
    characters: [bob, alice]
});
export const ANTAGONIST_CHARS = new CharacterPoll({
    name: 'Antagonist',
    description: 'The Antagonist of the story',
    characters: [sarah, jack]
});