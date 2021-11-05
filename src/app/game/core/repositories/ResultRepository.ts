import { Result, ResultType } from '../models/Result';

export class ResultRepository {
    static results: Result[] = [];
    static lastIdUsed = -1;

    static loadResults(results: Array<Result>) {
        ResultRepository.results = [];
        ResultRepository.lastIdUsed = -1;
        results.forEach(r => {
            ResultRepository.results.push(r);
            ResultRepository.lastIdUsed += 1;
        });
    }

    static addResult(result: Result) {
        ResultRepository.lastIdUsed += 1;
        result.id = ResultRepository.lastIdUsed;
        ResultRepository.results.push(result);

        return ResultRepository.results[ResultRepository.lastIdUsed];
    }

    static get(id: number) {
        if (id > -1 && ResultRepository.results.length > id) {
            return ResultRepository.results[id];
        }
        return null;
    }

    static getBest(obj: any) {
        if (obj.type === ResultType.GAME_END
            || obj.type === ResultType.GAME_TRUE_END
            || obj.type === ResultType.REWIND_DISABLED
            || obj.type === ResultType.SHAKE) {
            return ResultRepository.getBestByType(obj.type);
        }
        if (obj.type === ResultType.SOUND_EFFECT) {
            return ResultRepository.getBestSoundResult(obj);
        }
        if (obj.type === ResultType.PLAYER_TAG) {
            return ResultRepository.getBestTagResult(obj);
        }
        if (obj.type === ResultType.PAR_AVAILABLE) {
            return ResultRepository.getBestParResult(obj);
        }
        if (obj.type === ResultType.ADD_TO_LOG) {
            return ResultRepository.getBestAddToLogResult(obj);
        }

        // unknown result type to the engine
        return undefined;
    }

    private static getBestParResult(obj: any) {
        const result = ResultRepository.results
            .filter(r => r.type === ResultType.PAR_AVAILABLE)
            .filter(r => r.paragraphId === obj.paragraphId);
        
        if (!result || result.length !== 1) {
            return ResultRepository.addResult(new Result({
                type: ResultType.PAR_AVAILABLE,
                paragraphId: obj.paragraphId
            }));
        }

        return result[0];
    }

    private static getBestAddToLogResult(obj: any) {
        const result = ResultRepository.results
            .filter(r => r.type === ResultType.ADD_TO_LOG)
            .filter(r => r.logEntry === obj.logEntry);

        if (!result || result.length !== 1) {
            return ResultRepository.addResult(new Result({
                type: ResultType.ADD_TO_LOG,
                isHidden: true,
                logEntry: obj.logEntry
            }));
        }
        return result[0];
    }

    private static getBestTagResult(obj: any) {
        const result = ResultRepository.results
            .filter(r => r.type === ResultType.PLAYER_TAG)
            .filter(r => areArraysEquals(r.tagsToAdd, obj.tagsToAdd))
            .filter(r => areArraysEquals(r.tagsToRemove, obj.tagsToRemove));

        if (!result || result.length !== 1) {
            return ResultRepository.addResult(new Result({
                type: ResultType.PLAYER_TAG,
                tagsToAdd: obj.tagsToAdd,
                tagsToRemove: obj.tagsToRemove
            }));
        }

        return result[0];
    }

    private static getBestSoundResult(obj: any) {
        const result = ResultRepository.results
            .filter(r => r.type === ResultType.SOUND_EFFECT)
            .filter(r => areArraysEquals(r.soundIds, obj.soundIds));

        if (!result || result.length !== 1) {
            return ResultRepository.addResult(new Result({
                type: ResultType.SOUND_EFFECT,
                isHidden: true,
                soundIds: obj.soundIds
            }));
        }
        return result[0];
    }

    private static getBestByType(requiredType: ResultType) {
        const result = ResultRepository.results.filter(r => r.type === requiredType);

        return result[0];
    }

    static isHidden(id: number) {
        const result = ResultRepository.get(id);
        return result && result.isHidden;
    }
}

function areArraysEquals(first: Array<string>, second: Array<string>) {
    if (!first && !second) {
        return true;
    }
    if (!first || !second || first.length !== second.length) {
        return false;
    }
    return first.filter(f => second.find(s => s === f)).length === first.length;
}
