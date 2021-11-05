import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ParagraphRepository } from '../core/repositories/ParagraphRepository';
import { fieldsInJson, Paragraph } from '../core/models/Paragraph';
import { SimpleParagraph } from '../core/models/SimpleParagraph';
import { GameEngine } from '../core/engine/GameEngine';
import { StatisticsHandler } from '../core/services/StatisticsService';

@Component({
  selector: 'app-game-reviewer',
  templateUrl: './game-reviewer.component.html',
  styleUrls: ['./game-reviewer.component.css']
})
export class GameReviewerComponent implements OnInit {

  @Input() engine!: GameEngine;
  @Output() callOnExploreAgain: EventEmitter<any> = new EventEmitter();
  @ViewChild('paragraphs') textArea!: ElementRef;

  thereAreNewPars = false;
  showNewPars = false;
  newParsStringified = '';

  totalNumberOfPars!: number;
  totalNumberOfTrueEndings!: number;

  visitedPars!: number;
  visitedParsInGame!: number;
  trueEndings!: number;
  trueEndingsInGame!: number;

  rewinds!: number;
  gameOvers!: number;
  firstCommonLogEntry?: string[];
  secondCommonLogEntry?: string[];

  showMap = false;
  globalMap = false;
  simplePars!: SimpleParagraph[];

  showGameLog = false;
  logsEntries: string[] = [];
  gameLogTitle!: string;

  constructor() { }

  ngOnInit() {
    // new pars
    const newPars = ParagraphRepository.getAllNew();
    this.thereAreNewPars = newPars.length > 0;
    this.newParsStringified = JSON.stringify(newPars, fieldsInJson(), 2);

    // stats
    const statistics = StatisticsHandler.statisticsService.getStatistics();
    this.totalNumberOfPars = ParagraphRepository.countAllPars(
      (par: Paragraph) => !this.engine.isParImpossible(par));
    this.totalNumberOfTrueEndings = ParagraphRepository.countAllPars(
      (par: Paragraph) => this.engine.isParTrueEnding(par));

    this.visitedPars = ParagraphRepository.countVisitedParsGlobally();
    this.trueEndings = statistics.trueEndings.length;
    this.rewinds = statistics.rewinds;
    this.gameOvers = statistics.gameOvers;
    this.firstCommonLogEntry = statistics.getCommonEntryNumber(0);
    this.secondCommonLogEntry = statistics.getCommonEntryNumber(1);

    // stats in game
    this.visitedParsInGame = ParagraphRepository.countVisitedParsInGame();
    this.trueEndingsInGame = this.engine.game.slot.trueEndings;

    // map
    const assignVisibility = (par: Paragraph) => this.engine.isParVisible(par);
    this.simplePars = ParagraphRepository.getAllSimple(assignVisibility);

    // game logs
    this.logsEntries = this.engine.game.log;
    this.gameLogTitle = this.engine.gameTemplate.logTitle;
  }

  selectAllParagraphs() {
    this.textArea.nativeElement.focus();
    this.textArea.nativeElement.setSelectionRange(0, this.newParsStringified.length);
  }

  onExploreAgain() {
    this.callOnExploreAgain.emit();
  }
}
