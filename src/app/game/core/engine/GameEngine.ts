import { GameService } from '../services/GameService';
import { Game } from '../models/Game';
import { Paragraph } from '../models/Paragraph';
import { AudioHandler } from '../services/AudioService';
import { TutorialService } from '../services/TutorialService';
import { GameTemplateRepository } from '../repositories/GameTemplateRepository';
import { CharacterRepository } from '../repositories/CharacterRepository';
import { GameTemplate } from '../models/GameTemplate';
import { ResultRepository } from '../repositories/ResultRepository';
import { ConditionRepository } from '../repositories/ConditionRepository';
import { ParagraphRepository } from '../repositories/ParagraphRepository';
import { GameMessageService } from '../services/GameMessageService';
import { TUTORIAL_REWIND } from '../repositories/TutorialRepository';
import { StatisticsHandler } from '../services/StatisticsService';
import { GameLogRepository } from '../repositories/GameLogRepository';

export class GameEngine {

    gameService: GameService;

    templateId: string;
    gameTemplate: GameTemplate;
    game!: Game;

    constructor(templateId: string) {
        this.templateId = templateId;
        this.gameTemplate = GameTemplateRepository.get(templateId);
        CharacterRepository.loadCharacter([this.gameTemplate.player, this.gameTemplate.other]);
        ResultRepository.loadResults(this.gameTemplate.results);
        ConditionRepository.loadConditions(this.gameTemplate.conditions);
        ParagraphRepository.loadParagraphs(this.gameTemplate.paragraphs);
        GameMessageService.loadMessages(this.gameTemplate.messages, this.gameTemplate.pauseMessages);
        GameLogRepository.loadLogEntries(this.gameTemplate.logEntries);
        AudioHandler.audioService.loadMusics(this.gameTemplate.musics);
        StatisticsHandler.statisticsService.load(templateId);

        this.gameService = new GameService();
        this.gameService.prepareService();
    }

    setupGame(game: Game) {
        this.game = game;
        this.gameService.setupGame(game);
    }

    startGame() {
        this.gameService.startGame(this.game);
        AudioHandler.audioService.startMusic();

        return this.game.currentPar;
    }

    onOptionsChanged() {
        AudioHandler.audioService.checkOptions();
    }

    stopGame() {
        AudioHandler.audioService.stopMusic();
    }

    showTutorialMessage(tutorialKey: string) {
        TutorialService.trigger(tutorialKey, this.game);
    }

    refreshConditions() {
        this.gameService.refreshConditions(this.game);
    }

    getPossiblePars() {
        return this.gameService.getPossiblePars(this.game);
    }

    isParVisible(paragraph: Paragraph): boolean {
        return this.gameService.isParVisible(paragraph, this.game);
    }

    isParImpossible(paragraph: Paragraph): boolean {
        return this.gameService.isParImpossible(paragraph, this.game);
    }

    isParTrueEnding(paragraph: Paragraph): boolean {
        return this.gameService.isParTrueEnding(paragraph, this.game);
    }

    nextPar(id: number) {
        if (this.gameService.isValidChoise(this.game, id)) {
            this.gameService.applyChoise(this.game, id);
            return this.game.currentPar;
        }
        return undefined;
    }

    setNextPar(p: Paragraph) {
        this.gameService.setNextPar(this.game, p);
    }

    previousPar(untilDecision: boolean) {
        if (untilDecision) {
            this.gameService.previousDecisionPar(this.game);
        } else {
            this.gameService.previousPar(this.game);
        }
        TutorialService.trigger(TUTORIAL_REWIND, this.game);
    }

    onConsoleOpened() {
        if (this.gameTemplate.onConsoleOpened
            && !this.game.isGameOver && !this.game.isTrueGameOver) {
            const goingTo = this.gameTemplate.onConsoleOpened();
            if (goingTo) {
                this.gameService.applyChoise(this.game, goingTo);
            }
        }
    }
}
