import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ADULT_TAG, NO_GOING_BACK_TAG, Paragraph } from '../core/models/Paragraph';
import { Player } from '../core/models/Player';
import { Character } from '../core/models/Character';
import { ConditionService } from '../core/services/ConditionService';
import { ResultRepository } from '../core/repositories/ResultRepository';
import { OptionRepository, OPTION_EDIT_MODE } from '../core/repositories/OptionRepository';

@Component({
  selector: 'app-game-action-area',
  templateUrl: './game-action-area.component.html',
  styleUrls: ['./game-action-area.component.css']
})
export class GameActionAreaComponent implements OnInit {
  @Input() paragraphs!: Array<Paragraph>;
  @Input() player!: Player;
  @Input() other!: Character;
  @Input() conditionsSettling!: Map<string, boolean>;
  @Input() isRewindAvailable!: boolean;

  @Output() callOnChoice: EventEmitter<any> = new EventEmitter();
  @Output() callOnSet: EventEmitter<any> = new EventEmitter();
  @Output() callOnEditChange: EventEmitter<any> = new EventEmitter();
  @Output() callOnGoBack: EventEmitter<any> = new EventEmitter();
  @Output() callOnShowMap: EventEmitter<any> = new EventEmitter();
  @Output() callOnRefreshCondition: EventEmitter<any> = new EventEmitter();
  @Output() callOnShowLog: EventEmitter<any> = new EventEmitter();

  showEdit = false;
  isEditMode = false;
  isOptionMode = false;
  newPar!: Paragraph;

  isHandlingChoice = false;
  handlingChoice!: Paragraph;

  isAskingConfirmation = false;
  confirmationText!: string;
  askingConfirmation!: Paragraph;

  constructor() { }

  ngOnInit() {
    this.newPar = new Paragraph();
    this.showEdit = OptionRepository.getOption(OPTION_EDIT_MODE);
  }

  onOptionMode() {
    this.isOptionMode = true;
    this.isEditMode = false;
  }

  onEditOpen() {
    this.isOptionMode = false;
    this.isEditMode = true;
    this.callOnEditChange.emit(true);
  }

  onMultipleGoBack() {
    this.isOptionMode = false;
    this.callOnGoBack.emit(true);
  }

  onRefreshConditions() {
    this.isOptionMode = false;
    this.callOnRefreshCondition.emit(true);
  }

  onShowMap() {
    this.callOnShowMap.emit(true);
  }

  onShowLog() {
    this.callOnShowLog.emit(true);
  }

  onEditCancel(event?: any) {
    this.isEditMode = false;
    this.callOnEditChange.emit(false);
  }

  onEditSubmit(newPar: Paragraph) {
    this.isEditMode = false;
    this.callOnEditChange.emit(false);

    this.newPar = newPar;
    this.callOnSet.emit(this.newPar);
  }

  onParagraphChoice(p: Paragraph) {
    if (p.arguments && p.arguments.indexOf(NO_GOING_BACK_TAG) > -1) {
      // we ask for confirmation
      this.askConfirmation(p, 'Are you sure? There\'s no going back from this..');
    } else if (p.arguments && p.arguments.indexOf(ADULT_TAG) > -1) {
      // we ask for confirmation
      this.askConfirmation(p, 'Are you sure? Adult stuff inside.. enter only if you are ok with it..');
    } else {
      // we try to advance immediately
      this.tryAdvanceParagraph(p);
    }
  }

  onChoiceConfirm() {
    this.isAskingConfirmation = false;
    this.tryAdvanceParagraph(this.askingConfirmation);
  }

  onChoiceCancel() {
    this.isAskingConfirmation = false;
  }

  onHandlerEnded(obj: any) {
    this.isHandlingChoice = false;
    if (obj.result) {
      this.advanceParagraph(obj.p);
    } else {
      const settlingId = ConditionService.getSettlingId(obj.p.id,
        obj.p.condition);
      this.conditionsSettling.set(settlingId, false);
    }
  }

  shouldChoiceBeDisabled(p: Paragraph) {
    if (p.condition === undefined) {
      return false;
    }

    const settlingId = ConditionService.getSettlingId(p.id, p.condition);
    return this.conditionsSettling.has(settlingId)
      && !this.conditionsSettling.get(settlingId);
  }

  hasChoiceResult(p: Paragraph) {
    return p.results !== undefined && p.results.length > 0
      && p.results.filter(r => !ResultRepository.isHidden(r)).length > 0;
  }

  hasChoiceSettlingCondition(p: Paragraph) {
    if (p.condition === undefined) {
      return false;
    }

    const settlingId = ConditionService.getSettlingId(p.id, p.condition);
    return this.conditionsSettling.has(settlingId)
      && this.conditionsSettling.get(settlingId);
  }

  private askConfirmation(par: Paragraph, text: string) {
    this.isAskingConfirmation = true;
    this.askingConfirmation = par;
    this.confirmationText = text;
  }

  private tryAdvanceParagraph(p: Paragraph) {
    if (p.condition !== undefined
      && ConditionService.requireHandlingCondition(p.condition)) {
      this.isHandlingChoice = true;
      this.handlingChoice = p;
    } else {
      this.advanceParagraph(p);
    }
  }

  private advanceParagraph(p: Paragraph) {
    this.callOnChoice.emit(p.id);
  }
}
