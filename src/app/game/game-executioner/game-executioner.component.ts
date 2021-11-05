import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GameEngine } from '../core/engine/GameEngine';
import { Game } from '../core/models/Game';
import { Paragraph } from '../core/models/Paragraph';
import { AudioHandler } from '../core/services/AudioService';
import { ParagraphRepository } from '../core/repositories/ParagraphRepository';
import { SimpleParagraph } from '../core/models/SimpleParagraph';
import { OptionRepository, OPTION_NONINVASIVE_TUTORIAL } from '../core/repositories/OptionRepository';

@Component({
  selector: 'app-game-executioner',
  templateUrl: './game-executioner.component.html',
  styleUrls: ['./game-executioner.component.css']
})
export class GameExecutionerComponent implements OnInit {
  @Input() engine!: GameEngine;
  @Output() callOnEndGame: EventEmitter<any> = new EventEmitter();

  playerReady = false;
  gamePaused = false;
  gameMap = false;
  globalMap = false;
  stopCheckingConsole = false;

  game!: Game;
  nextParagraphs!: Array<Paragraph>;
  additionalParagraphs!: Array<Paragraph>;

  isEditMode = false;
  simplePars!: SimpleParagraph[];
  currentParId!: number;

  isShowingMessages = false;
  showGameLog = false;
  gameLogTitle!: string;

  constructor() { }

  ngOnInit() {
    this.game = this.engine.game;
    this.gameLogTitle = this.engine.gameTemplate.logTitle;

    this.nextParagraphs = this.engine.getPossiblePars();
  }

  setReady() {
    this.playerReady = true;
    this.scrollToLastPar();
    this.checkIfConsoleIsOpen();
  }

  scrollToLastPar() {
    const self = this;
    setTimeout(() => {
      self.scrollTo('game-message-' + (self.game.pMap.length - 1));
    }, 200);
  }

  scrollTo(destination: string) {
    // TODO implement
  }

  onParagraphChoice(id: number) {
    if (this.engine.nextPar(id) !== undefined) {
      this.nextParagraphs = this.engine.getPossiblePars();
    }
    this.scrollToLastPar();
  }

  onInnerParagraphChoice(id: any) {
    this.onParagraphChoice(id);
  }

  onParagraphSet(par: Paragraph) {
    this.engine.setNextPar(par);
    this.nextParagraphs = this.engine.getPossiblePars();
    this.scrollToLastPar();
  }

  onRefreshCondition(event: any) {
    this.engine.refreshConditions();
    this.nextParagraphs = this.engine.getPossiblePars();
  }

  onParagraphBack(untilDecision: boolean) {
    this.engine.previousPar(untilDecision);
    this.nextParagraphs = this.engine.getPossiblePars();
    this.scrollToLastPar();
  }

  onShowMap(showMap: boolean) {
    this.gameMap = showMap;
    if (this.gameMap) {
      const assignVisibility = (par: Paragraph) => this.engine.isParVisible(par);
      this.simplePars = ParagraphRepository.getAllSimple(assignVisibility);
      this.currentParId = this.game.currentPar.id;
    } else {
      this.scrollToLastPar();
      this.globalMap = false;
    }
  }

  onPauseGame(event?: any) {
    this.gamePaused = true;
    this.isEditMode = false;
    AudioHandler.audioService.pauseMusic();
  }

  onResumeGame(event?: any) {
    this.gamePaused = false;
    AudioHandler.audioService.resumeMusic();
    this.engine.onOptionsChanged();
    this.engine.refreshConditions();
    this.nextParagraphs = this.engine.getPossiblePars();
    this.scrollToLastPar();
  }

  onEndGame(event?: any) {
    this.gamePaused = false;
    this.stopCheckingConsole = true;
    this.callOnEndGame.emit(this.engine);
  }

  onEditModeChange(isEditMode: boolean) {
    this.isEditMode = isEditMode;
    if (!this.isEditMode) {
      this.scrollToLastPar();
    }
  }

  onMessageRead(event?: any) {
    this.game.playerMessages.pop();
    if (this.isShowingMessages && this.game.playerMessages.length === 0) {
      this.isShowingMessages = false;
    }
  }

  canShowMessages() {
    return this.game.playerMessages.length > 0
      && (!OptionRepository.getOption(OPTION_NONINVASIVE_TUTORIAL) || this.isShowingMessages);
  }

  canShowMessagesIndicator() {
    return this.game.playerMessages.length > 0
      && OptionRepository.getOption(OPTION_NONINVASIVE_TUTORIAL);
  }

  onShowMessages(event?: any) {
    this.isShowingMessages = true;
  }

  onShowLog(showLog: boolean) {
    this.showGameLog = showLog;
    if (!this.showGameLog) {
      this.scrollToLastPar();
    }
  }

  checkIfConsoleIsOpen() {
    const self = this;

    setTimeout(() => {
      const anyWindow = window as any;
      if (anyWindow['check_time'] && anyWindow['check_time']()) {
        // looks like it is open
        if (!self.stopCheckingConsole) {
          self.onConsoleOpened();
          self.stopCheckingConsole = true;
        }
      } else if (!self.stopCheckingConsole) {
        self.checkIfConsoleIsOpen();
      }
    }, 10000);
  }

  onConsoleOpened() {
    this.engine.onConsoleOpened();
    this.nextParagraphs = this.engine.getPossiblePars();
    this.scrollToLastPar();
  }
}
