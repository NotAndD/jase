import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GameTemplate } from '../core/models/GameTemplate';
import { GameTemplateRepository } from '../core/repositories/GameTemplateRepository';

@Component({
  selector: 'app-game-template-loader',
  templateUrl: './game-template-loader.component.html',
  styleUrls: ['./game-template-loader.component.css']
})
export class GameTemplateLoaderComponent implements OnInit {

  @Input() canShowWip!: boolean;
  @Output() callOnTemplateSelect: EventEmitter<any> = new EventEmitter();

  localTemplates: GameTemplate[] = [];
  templateSelected?: GameTemplate;

  constructor() { }

  ngOnInit(): void {
    this.localTemplates = GameTemplateRepository.list();
    if (!this.canShowWip) {
      this.localTemplates = this.localTemplates.filter(t => !t.wip);
    }
  }

  onLocalTemplateChoice(): void {
    if (!this.templateSelected) {
      // impossible
      return;
    }

    this.callOnTemplateSelect.emit(this.templateSelected.id);
  }

}
