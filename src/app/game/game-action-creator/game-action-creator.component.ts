import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Paragraph } from '../core/models/Paragraph';
import { Player } from '../core/models/Player';
import { Character } from '../core/models/Character';

@Component({
  selector: 'app-game-action-creator',
  templateUrl: './game-action-creator.component.html',
  styleUrls: ['./game-action-creator.component.css']
})
export class GameActionCreatorComponent implements OnInit {
  @Input() player!: Player;
  @Input() other!: Character;
  @Output() callOnSubmit: EventEmitter<any> = new EventEmitter();
  @Output() callOnCancel: EventEmitter<any> = new EventEmitter();

  newPar!: Paragraph;

  creatorPhase = 0;
  currPhase = 0;

  constructor() { }

  ngOnInit() {
    this.newPar = new Paragraph();
    this.newPar.text = '';
  }

  onApplyPhase(newPar: Paragraph) {
    this.newPar = newPar;
    this.currPhase += 1;
    if (this.creatorPhase < this.currPhase) {
      this.creatorPhase += 1;
    }

    if (this.creatorPhase === 3) {
      this.onSubmit();
    }
  }

  onCancel(event?: any) {
    this.callOnCancel.emit();
  }

  onSubmit() {
    this.callOnSubmit.emit(this.newPar);
  }

}
