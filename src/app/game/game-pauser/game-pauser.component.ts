import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { getParagraphCompiledText } from '../core/services/ParagraphService';
import { GameEngine } from '../core/engine/GameEngine';
import { GameMessageService } from '../core/services/GameMessageService';

@Component({
  selector: 'app-game-pauser',
  templateUrl: './game-pauser.component.html',
  styleUrls: ['./game-pauser.component.css']
})
export class GamePauserComponent implements OnInit {
  @Input() engine!: GameEngine;
  @Output() callOnResumeGame: EventEmitter<any> = new EventEmitter();
  @Output() callOnExitGame: EventEmitter<any> = new EventEmitter();

  sillyMessage = '...';
  showOptions = false;

  constructor() { }

  ngOnInit() {
    const game = this.engine.game;
    const randomMessage = GameMessageService.getRandomPauseMessage();
    this.sillyMessage = getParagraphCompiledText(randomMessage, game.player.character, game.other);
  }

  onResumeGame() {
    this.callOnResumeGame.emit();
  }

  onExitGame() {
    this.callOnExitGame.emit();
  }

  onGameOptionsSubmit(event: any) {
    this.showOptions = false;
  }

}
