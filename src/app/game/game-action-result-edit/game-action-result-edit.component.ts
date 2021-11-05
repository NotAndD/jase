import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Paragraph } from '../core/models/Paragraph';
import { Character } from '../core/models/Character';
import { ResultRepository } from '../core/repositories/ResultRepository';
import { Result, ResultType } from '../core/models/Result';
import { Player } from '../core/models/Player';

@Component({
  selector: 'app-game-action-result-edit',
  templateUrl: './game-action-result-edit.component.html',
  styleUrls: ['./game-action-result-edit.component.css']
})
export class GameActionResultEditComponent {
  @Input() newPar!: Paragraph;
  @Input() player!: Player;
  @Input() other!: Character;
  @Output() callOnSubmit: EventEmitter<any> = new EventEmitter();
  @Output() callOnCancel: EventEmitter<any> = new EventEmitter();

  isGameEnder = false;
  isTrueGameEnder = false;
  hasSoundEffect = false;
  disableRewind = false;
  shake = false;
  isParAvailable = false;

  playAudioSoundIds = '';
  parAvailable = '';

  onCancel() {
    this.callOnCancel.emit();
  }

  onSubmit() {
    if (this.isGameEnder) {
      this.pushOnResults(ResultRepository.getBest({ type: ResultType.GAME_END }));
    }
    if (this.hasSoundEffect && this.playAudioSoundIds) {
      this.pushOnResults(ResultRepository.getBest({
        type: ResultType.SOUND_EFFECT,
        soundIds: this.playAudioSoundIds.split(' ')
      }));
    }
    if (this.isTrueGameEnder) {
      this.pushOnResults(ResultRepository.getBest({ type: ResultType.GAME_TRUE_END }));
    }
    if (this.disableRewind) {
      this.pushOnResults(ResultRepository.getBest({ type: ResultType.REWIND_DISABLED }));
    }
    if (this.shake) {
      this.pushOnResults(ResultRepository.getBest({ type: ResultType.SHAKE }));
    }
    if (this.isParAvailable) {
      this.pushOnResults(ResultRepository.getBest({
        type: ResultType.PAR_AVAILABLE,
        paragraphId: +this.parAvailable
      }));
    }

    this.callOnSubmit.emit(this.newPar);
  }

  pushOnResults(result: Result | undefined) {
    if (!this.newPar.results) {
      this.newPar.results = new Array();
    }
    if (result) {
      this.newPar.results.push(result.id);
    }
  }

}
