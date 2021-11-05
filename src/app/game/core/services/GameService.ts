import { Game } from '../models/Game';
import { GameRepository } from '../repositories/GameRepository';
import { ParagraphRepository } from '../repositories/ParagraphRepository';
import { Paragraph } from '../models/Paragraph';
import { ParagraphService } from './ParagraphService';
import { ResultService } from './ResultService';
import { ConditionService } from './ConditionService';
import { TutorialService } from './TutorialService';
import { TUTORIAL_BEGIN, TUTORIAL_COMPLETELY_EXPLORED,
    TUTORIAL_FIRST_CHOISE, TUTORIAL_GAME_OVER,
    TUTORIAL_MULTIPLE_PATHS, TUTORIAL_RESULT,
    TUTORIAL_TRUE_GAME_OVER } from '../repositories/TutorialRepository';
import { StorageHandler } from './StorageService';
import { ResultRepository } from '../repositories/ResultRepository';
import { StatisticsHandler } from './StatisticsService';
import { GAME_START_LOG } from '../repositories/GameLogRepository';


export class GameService {

    paragraphService!: ParagraphService;
    resultService!: ResultService;
    conditionService!: ConditionService;

    newParagraphCreated = false;

    prepareService() {
        this.paragraphService = new ParagraphService();
        this.resultService = new ResultService();
        this.conditionService = new ConditionService();
    }

    setupGame(g: Game) {
        this.newParagraphCreated = false;
        GameRepository.add(g);
        TutorialService.load();
        StatisticsHandler.statisticsService.setup();

        g.visitedPars.forEach(id => ParagraphRepository.setVisited(id,
            par => !this.isParImpossible(par, g) && this.isParVisible(par, g)));
    }

    startGame(g: Game) {
        this.paragraphService.setup(g);

        if (!g.isStarted) {
            g.isStarted = true;
            g.slot.description = g.player.character.name + ' / ' + g.other.name;
            g.slot.isEmpty = false;
            g.currentPar = ParagraphRepository.get(0);
            this.visitCurrentPar(g);
            g.pMap.push(this.paragraphService.paragraphToMessage(g.currentPar));
            g.log.push(GAME_START_LOG);
        } else if (g.currentPar) {
            // reload current par.. there could be new paths available
            g.currentPar = ParagraphRepository.get(g.currentPar.id);
        }
        TutorialService.trigger(TUTORIAL_BEGIN, g);

        this.saveGame(g);
    }

    refreshConditions(g: Game) {
        if (g.isRewindAvailable) {
            g.conditionsSettling.clear();
        }
    }

    getPossiblePars(g: Game) {
        const result: Paragraph[] = []
        if (g.currentPar.sons) {
            this.getParsFrom(g, g.currentPar.sons)
                .forEach(p => result.push(p));
        }
        this.getParsFrom(g, g.additionalPars)
            .forEach(p => result.push(p));

        return result;
    }

    private getParsFrom(g: Game, parIds: number[]) {
        if (!parIds || parIds.length === 0) {
            return [];
        }

        let result = ParagraphRepository.multiGet(parIds);
        result = result.filter(p => p.condition === undefined
            || this.conditionService.isRespected(p.id, p.condition, g));

        if (result && result.length > 1) {
            TutorialService.trigger(TUTORIAL_MULTIPLE_PATHS, g);
        }
        if (result && result.filter(p => p.results !== undefined && p.results.length > 0
            && p.results.filter(r => !ResultRepository.isHidden(r)).length > 0).length > 0) {
            TutorialService.trigger(TUTORIAL_RESULT, g);
        }
        if (result && result.filter(p => p.visited.completelyInGame).length > 0) {
            TutorialService.trigger(TUTORIAL_COMPLETELY_EXPLORED, g);
        }
        return result;
    }

    isValidChoise(g: Game, id: number) {
        if (g.currentPar.sons && g.currentPar.sons.indexOf(id) !== -1
            || g.currentPar.innerSons && g.currentPar.innerSons.indexOf(id) !== -1
            || g.additionalPars && g.additionalPars.indexOf(id) !== -1) {
            return this.checkParagraph(g, ParagraphRepository.get(id));
        }

        return false;
    }

    applyChoise(g: Game, id: number) {
        const p = ParagraphRepository.get(id);
        this.advanceToPar(g, p);
        
        TutorialService.trigger(TUTORIAL_FIRST_CHOISE, g);
    }

    
    setNextPar(g: Game, p: Paragraph) {
        ParagraphRepository.add(p, g.currentPar);
        this.newParagraphCreated = true;

        this.advanceToPar(g, p);
    }

    previousPar(g: Game) {
        if (g.pMap.length > 1 && g.isRewindAvailable) {
            const oldId = g.pMap[g.pMap.length - 1].id;
            this.revertPar(g, oldId);
            this.backToPar(g, g.pMap.length - 2);
            StatisticsHandler.statisticsService.onRewind();
        }
    }

    previousDecisionPar(g: Game) {
        if (!g.isRewindAvailable) {
            return;
        }

        const mapLength = g.pMap.length;
        let curIndex: number | undefined;
        for (let i = 1; i < mapLength; i += 1) {
            curIndex = mapLength - i - 1;
            const curParId = g.pMap[curIndex].id;
            const curPar = ParagraphRepository.get(curParId);
            this.revertPar(g, curParId);
            if (this.isValidDecisionPar(curPar, g)) {
                break;
            }
        }
        if (curIndex !== undefined) {
            this.backToPar(g, curIndex);
        }
        StatisticsHandler.statisticsService.onRewind();
    }

    isParVisible(par: Paragraph, g: Game) {
        return par.condition === undefined
            || this.conditionService.isConditionVisible(par.condition, g);
    }

    isParImpossible(par: Paragraph, g: Game): boolean {
        return par.condition !== undefined
            && this.conditionService.isImpossible(par.condition, g);
    }

    isParTrueEnding(par: Paragraph, g: Game): boolean {
        return par.results !== undefined 
            && par.results.filter(r => this.resultService.isTrueEnding(r, g)).length > 0;
    }

    private visitCurrentPar(g: Game) {
        if (ParagraphRepository.newVisitInGame(g.currentPar)) {
            g.visitedPars.push(g.currentPar.id);
            g.slot.exploration = g.visitedPars.length;
        }
        if (ParagraphRepository.newVisitGlobally(g.currentPar)) {
            StatisticsHandler.statisticsService.onVisitPar(g.currentPar.id);
        }
        ParagraphRepository.visit(g.currentPar,
            par => !this.isParImpossible(par, g) && this.isParVisible(par, g));
    }

    private checkParagraph(g: Game, p: Paragraph) {
        if (p.condition !== undefined) {
            return this.conditionService.isRespected(p.id,
                p.condition, g);
        }
        return true;
    }

    private advanceToPar(g: Game, p: Paragraph) {
        g.currentPar = p;
        this.visitCurrentPar(g);
        this.ensureNoLoopInAdditionalPars(g, p);
        g.pMap.push(this.paragraphService.paragraphToMessage(g.currentPar));
        g.conditionsSettling.clear();

        this.applyResult(g);
    }

    private ensureNoLoopInAdditionalPars(g: Game, p: Paragraph) {
        if (g.additionalPars && g.additionalPars.indexOf(p.id) !== -1) {
            g.additionalPars.splice(g.additionalPars.indexOf(p.id), 1);
        }
    }

    private isValidDecisionPar(par: Paragraph, g: Game) {
        const sonsLength = !par.sons ? 0 : par.sons.filter(id =>
            this.isParVisible(ParagraphRepository.get(id), g)).length;
        const innerSonsLength = par.innerSons ? par.innerSons.length : 0;
        return sonsLength + innerSonsLength > 1;
    }

    private backToPar(g: Game, index: number) {
        const newParId = g.pMap[index].id;
        g.pMap = g.pMap.slice(0, index);
        this.applyChoise(g, newParId);
    }

    private revertPar(g: Game, id: number) {
        const par = ParagraphRepository.get(id);
        this.resultService.revertAll(par.results, g);
    }

    private applyResult(g: Game) {
        this.resultService.cleanUp(g);
        const rebuildCompletelyVisit = this.resultService.mayAnyUnlockNewPaths(
            g.currentPar.results, g);

        this.resultService.applyAll(g.currentPar.results, g);
        g.turn += 1;
        if (g.isGameOver && !g.isTrueGameOver) {
            TutorialService.trigger(TUTORIAL_GAME_OVER, g);
            StatisticsHandler.statisticsService.onGameOver();
        }
        if (g.isTrueGameOver) {
            TutorialService.trigger(TUTORIAL_TRUE_GAME_OVER, g);
            const wasFirstTime = StatisticsHandler.statisticsService.onTrueGameOver(
                g.currentPar.id);
            this.updateSavedGameAfterTrueGameOver(g, wasFirstTime);
        }
        if (rebuildCompletelyVisit) {
            ParagraphRepository.tryUnsetAllCompletelyVisit(
                par => !this.isParImpossible(par, g) && this.isParVisible(par, g));
        }

        this.saveGame(g);
    }

    private updateSavedGameAfterTrueGameOver(g: Game, wasFirstTime: boolean) {
        if (this.newParagraphCreated) {
            return;
        }

        const savedGame = StorageHandler.storageService.loadGame(
            g.slot.templateId, g.slot.slot, false);
        savedGame.visitedPars = g.visitedPars;
        savedGame.slot.exploration = g.visitedPars.length;
        if (wasFirstTime) {
            savedGame.slot.trueEndings = g.slot.trueEndings + 1;
        }
        savedGame.log = g.log;

        this.saveGame(savedGame);
    }

    private canSaveGame(g: Game) {
        return !this.newParagraphCreated && g.isRewindAvailable;
    }

    private saveGame(g: Game) {
        if (!this.canSaveGame(g)) {
            return;
        }
        StorageHandler.storageService.saveSlot(g.slot);
        StorageHandler.storageService.saveGame(g);
    }
}
