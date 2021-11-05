import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Game } from '../core/models/Game';
import { GameEngine } from '../core/engine/GameEngine';
import { Player } from '../core/models/Player';
import { GameTemplate } from '../core/models/GameTemplate';
import { Paragraph } from '../core/models/Paragraph';
import { ParagraphRepository } from '../core/repositories/ParagraphRepository';
import { Character } from '../core/models/Character';

@Component({
  selector: 'app-game-creator',
  templateUrl: './game-creator.component.html',
  styleUrls: ['./game-creator.component.css']
})
export class GameCreatorComponent implements OnInit {
  @Input() engine!: GameEngine;
  @Output() callOnStartGame: EventEmitter<any> = new EventEmitter();

  gameCreationPhase = -1;

  templateId!: string;
  totalNumberOfPars!: number;
  totalTrueEndings!: number;

  game!: Game;
  gameTemplate!: GameTemplate;

  constructor() { }

  ngOnInit() {
    this.templateId = this.engine.templateId;
    this.gameTemplate = this.engine.gameTemplate;
    this.totalNumberOfPars = ParagraphRepository.countAllPars(
      (par: Paragraph) => !this.engine.isParImpossible(par));
    this.totalTrueEndings = ParagraphRepository.countAllPars(
      (par: Paragraph) => this.engine.isParTrueEnding(par));
  }

  onSlotChoise(game: Game) {
    this.game = game;
    this.gameCreationPhase = game.isStarted ? 3 : 0;
    this.engine.setupGame(game);
  }

  onGameOptionsSubmit(event?: any) {
    this.gameCreationPhase = 1;
  }

  onYourCharacterSubmit(character: Character) {
    this.game.player = new Player();
    this.game.player.id = 1;
    this.game.player.character = character;

    this.gameCreationPhase = 2;
  }

  onOtherCharacterSubmit(character: Character) {
    this.game.other = character;
    this.gameCreationPhase = 3;
  }

  onCreationPhaseBack() {
    this.gameCreationPhase -= 1;
  }

  onGameStartBtn() {
    this.engine.game = this.game;
    this.callOnStartGame.emit(this.engine);
  }
}
