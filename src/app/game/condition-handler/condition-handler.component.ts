import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Paragraph } from '../core/models/Paragraph';
import { Condition, ConditionType } from '../core/models/Condition';
import { ConditionRepository } from '../core/repositories/ConditionRepository';

@Component({
  selector: 'app-condition-handler',
  templateUrl: './condition-handler.component.html',
  styleUrls: ['./condition-handler.component.css']
})
export class ConditionHandlerComponent implements OnInit {
  @Input() choice!: Paragraph;
  @Output() callOnEnd: EventEmitter<any> = new EventEmitter();

  constructor() { }

  condition!: Condition;

  ngOnInit() {
    if (this.choice.condition) {
      this.condition = ConditionRepository.get(this.choice.condition);
    }
  }

  isFatality() {
    return this.condition && this.condition.type === ConditionType.FATALITY;
  }

  onEnd(how: boolean) {
    this.callOnEnd.emit({ result: how, p: this.choice });
  }

}
