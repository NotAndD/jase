import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Paragraph } from '../core/models/Paragraph';
import { ConditionRepository } from '../core/repositories/ConditionRepository';
import { Player } from '../core/models/Player';
import { Character } from '../core/models/Character';
import { ConditionType } from '../core/models/Condition';

@Component({
  selector: 'app-game-action-edit',
  templateUrl: './game-action-edit.component.html',
  styleUrls: ['./game-action-edit.component.css']
})
export class GameActionEditComponent implements OnInit {
  @Input() newPar!: Paragraph;
  @Input() player!: Player;
  @Input() other!: Character;
  @Output() callOnSubmit: EventEmitter<any> = new EventEmitter();
  @Output() callOnCancel: EventEmitter<any> = new EventEmitter();

  isInner = false;
  arguments = '';

  // condition stuff
  conditionApplied = false;

  playerGender = false;
  otherGender = false;
  beingFast = false;
  fatality = false;

  difficulty = 0;

  constructor() { }

  ngOnInit() {
  }

  onCancel() {
    this.callOnCancel.emit();
  }

  onSubmit() {
    if (this.conditionApplied) {
      const condition = ConditionRepository.getBest(this.makeConditionObj());
      this.newPar.condition = condition ? condition.id : undefined;
    }
    if (this.isInner) {
      this.newPar.isInner = true;
    }
    if (this.arguments) {
      this.newPar.arguments = this.arguments.split(' ');
    }

    this.callOnSubmit.emit(this.newPar);
  }

  makeConditionObj() {
    const cType = this.getConditionType();
    const result = {
      type: cType,
      requiredPGender: this.playerGender,
      pGender: this.player.character.gender,
      requiredOGender: this.otherGender,
      oGender: this.other.gender,
      difficulty: +this.difficulty
    };

    return result;
  }

  getConditionType() {
    if (this.beingFast) {
      return ConditionType.BEING_FAST;
    }
    if (this.fatality) {
      return ConditionType.FATALITY;
    }
    return ConditionType.GENDER;
  }

}
