import { getRandomInt } from '../core/models/Character';
import { OptionRepository, OPTION_NO_KEYBOARD } from '../core/repositories/OptionRepository';

export const enum FATALITY_TYPE {
    SPACEBAR,
    COMBINATION,
    TIMING
}

const FATALITIES = [
    FATALITY_TYPE.SPACEBAR,
    FATALITY_TYPE.COMBINATION,
    FATALITY_TYPE.TIMING
];

const NO_KEYBOARD_FATALITIES = [
    FATALITY_TYPE.SPACEBAR,
    FATALITY_TYPE.TIMING
];

function simpleSpacebarGenerator() {
    return ' ';
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const IMPOSSIBLE_ALPHABET = '{}@!(%€^+|_;<§°ç?&╩ÀÆ║±♫¬å¥ä ╝Ìþ○▲¶äÉ';

function randomKeyGenerator() {
    return ALPHABET[getRandomInt(0, ALPHABET.length - 1)];
}

function randomImpossibleGenerator() {
    return IMPOSSIBLE_ALPHABET[getRandomInt(0, IMPOSSIBLE_ALPHABET.length - 1)];
}

export function getTextForFatality(type: FATALITY_TYPE) {
    const noKeyboard = OptionRepository.getOption(OPTION_NO_KEYBOARD);
    if (type === FATALITY_TYPE.TIMING) {
        return noKeyboard ? 'TAP HERE at right time' : 'SPACEBAR at right time';
    }
    if (type === FATALITY_TYPE.SPACEBAR) {
        return noKeyboard ? 'TAP HERE continuosly' : 'SMASH SPACEBAR';
    }
    return '';
}

export function getRandomFatality(difficulty: number) {
    const fatalityType = getRandomFatalityType();

    if (fatalityType === FATALITY_TYPE.SPACEBAR) {
        return makeFatalitySpaceBar(difficulty);
    }
    if (fatalityType === FATALITY_TYPE.COMBINATION) {
        return makeFatalityCombination(difficulty);
    }
    if (fatalityType === FATALITY_TYPE.TIMING) {
        return makeFatalityTiming(difficulty);
    }

    return undefined;
}

export function whatToDoOnImpossibleSuccess(currSituation: any) {
    if (currSituation.type === FATALITY_TYPE.SPACEBAR) {
        currSituation.progress = 99;
        currSituation.subtr += 1;
    } else if (currSituation.type === FATALITY_TYPE.COMBINATION) {
        currSituation.progress = 0;
        currSituation.keyGenerator = randomImpossibleGenerator;
    } else if (currSituation.type === FATALITY_TYPE.TIMING) {
        currSituation.progress = 0;
        currSituation.timingCenter = getRandomInt(2, 12) * 7;
        currSituation.timingMin = getTiming(currSituation.difficulty,
            currSituation.timingCenter, false);
        currSituation.timingMax = getTiming(currSituation.difficulty,
            currSituation.timingCenter, true);
    }

    return currSituation;
}

function getSubtrQuantity(difficulty: number, first: number, second: number) {
    return difficulty === 0 ? first : second;
}

function getTiming(difficulty: number, timingCenter: number, isToAdd: boolean) {
    const increment = difficulty === 0 ? 7 : 5;
    return  timingCenter + (isToAdd ? increment : -increment);
}

function makeFatalityTiming(difficulty: number) {
    const randomTiming = getRandomInt(2, 12) * 7;
    return {
        type: FATALITY_TYPE.TIMING,
        keyGenerator: simpleSpacebarGenerator,
        difficulty,
        isProgressWithTime: false,
        add: 100,
        subtr: 7,
        progress: 0,
        time: 100,
        showSingleKeyMode: true,
        timingMin: getTiming(difficulty, randomTiming, false),
        timingCenter: randomTiming,
        timingMax: getTiming(difficulty, randomTiming, true)
    };
}

function makeFatalityCombination(difficulty: number) {
    return {
        type: FATALITY_TYPE.COMBINATION,
        keyGenerator: randomKeyGenerator,
        difficulty,
        isProgressWithTime: false,
        add: difficulty !== 1 ? 40 : 20,
        subtr: getSubtrQuantity(difficulty, 4, 5),
        progress: 0,
        time: 100,
        showSingleKeyMode: false
    };
}

function makeFatalitySpaceBar(difficulty: number) {
    return {
        type: FATALITY_TYPE.SPACEBAR,
        keyGenerator: simpleSpacebarGenerator,
        difficulty,
        isProgressWithTime: true,
        add:  difficulty === 0 ? 3 : 2,
        subtr: getSubtrQuantity(difficulty, 1, 2),
        progress: 50,
        time: 50,
        showSingleKeyMode: true
    };
}

function getRandomFatalityType() {
    if (OptionRepository.getOption(OPTION_NO_KEYBOARD)) {
        return NO_KEYBOARD_FATALITIES[getRandomInt(0, NO_KEYBOARD_FATALITIES.length - 1)];
    }
    return FATALITIES[getRandomInt(0, FATALITIES.length - 1)];
}
