import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { OptionRepository, OPTION_NO_KEYBOARD } from '../core/repositories/OptionRepository';
import { getRandomFatality, whatToDoOnImpossibleSuccess,
  FATALITY_TYPE, getTextForFatality } from './fatality-builder';

@Component({
  selector: 'app-fatality-tester',
  templateUrl: './fatality-tester.component.html',
  styleUrls: ['./fatality-tester.component.css']
})
export class FatalityTesterComponent implements OnInit {
  @Input() difficulty!: number;
  @Input() sentence!: string;
  @Output() callOnFatalityEnd: EventEmitter<any> = new EventEmitter();

  leftWord!: string;
  rightWord!: string;

  isDone!: boolean;
  isSuccess!: boolean;
  currIdx = 0;

  noKeyboardMode!: boolean;

  situation: any;
  previousKey!: string;
  currentKey!: string;
  showSingleKeyMode!: boolean;
  singleKeyModeText!: string;
  showSecondBar!: boolean;

  constructor() { }

  ngOnInit() {
    this.prepareSituation();

    const splittedSentence = this.sentence.split(' ');
    this.leftWord = splittedSentence[splittedSentence.length - 1];
    this.rightWord = splittedSentence[0];

    const self = this;
    setTimeout(() => {
      self.onTickExpired();
    }, 300);
  }

  prepareSituation() {
    this.situation = getRandomFatality(this.difficulty);
    this.noKeyboardMode = OptionRepository.getOption(OPTION_NO_KEYBOARD);
    this.currentKey = this.situation.keyGenerator();
    this.showSingleKeyMode = this.situation.showSingleKeyMode;
    this.singleKeyModeText = getTextForFatality(this.situation.type);
    this.showSecondBar = this.situation.type === FATALITY_TYPE.TIMING;
    this.isDone = false;
  }

  @HostListener('document:keydown', ['$event'])
  onSmashButton(event: KeyboardEvent) {
    if (this.situation.time > 0
      && event.key === this.currentKey
      && !event.repeat) {
        this.onInputAccepted();
        this.previousKey = this.currentKey;
        this.currentKey = this.situation.keyGenerator();
    }
  }

  onInputAccepted() {
    if (this.situation.type !== FATALITY_TYPE.TIMING
      || this.situation.type === FATALITY_TYPE.TIMING
        && this.situation.timingMin <= this.situation.time
        && this.situation.timingMax >= this.situation.time) {
      this.onProgressAdd();
    } else if (this.situation.type === FATALITY_TYPE.TIMING) {
      this.onFatalityEnd(true);
    }
  }

  onProgressAdd() {
    this.situation.progress += this.situation.add;
    if (this.situation.isProgressWithTime) {
      this.situation.time += this.situation.add;
    }
    this.checkProgressStatus();
  }

  onTickExpired() {
    if (this.situation.progress < 100) {
      this.situation.time -= this.situation.subtr;
      if (this.situation.isProgressWithTime) {
        this.situation.progress -= this.situation.subtr;
      }
      if (!this.checkProgressStatus()) {
        const self = this;
        setTimeout(() => {
          if (self) {
            self.onTickExpired();
          }
        }, 300);
      }
    }
  }

  checkProgressStatus() {
    let isSuccesful = this.situation.progress >= 100;
    const isFailure = this.situation.time <= 0;

    if (isSuccesful && this.difficulty === 2) {
      this.situation = whatToDoOnImpossibleSuccess(this.situation);
      isSuccesful = false;
    }

    if (isFailure || isSuccesful) {
      this.onFatalityEnd(isFailure);
      return true;
    }
    return false;
  }

  onFatalityEnd(isFailure: boolean) {
    this.isDone = true;

    if (isFailure) {
      this.situation.progress = 0;
      this.situation.time = 0;
      this.isSuccess = false;
    } else {
      this.situation.progress = 100;
      this.situation.time = 100;
      this.isSuccess = true;
    }
    const emitter = this.callOnFatalityEnd;

    // give time for a result to appear on screen
    setTimeout(() => {
      emitter.emit(!isFailure);
    }, 2500);
  }

}
