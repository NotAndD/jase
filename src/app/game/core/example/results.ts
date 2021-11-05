import { Result, ResultType } from "../models/Result";

const endGame = new Result({
    id: 0,
    type: ResultType.GAME_END
});
const trueEndGame = new Result({
    id: 1,
    type: ResultType.GAME_TRUE_END
});
const noMoreRewind = new Result({
    id: 2,
    type: ResultType.REWIND_DISABLED
});
const shake = new Result({
    id: 3,
    type: ResultType.SHAKE,
    isHidden: true
});

export const RESULTS = [endGame, trueEndGame, noMoreRewind, shake];