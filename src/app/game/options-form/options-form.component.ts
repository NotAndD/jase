import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TutorialService } from '../core/services/TutorialService';
import { OptionRepository, OPTION_TUTORIAL, OPTION_SMARTPHONE,
  OPTION_MUSIC, OPTION_SOUND_EFFECTS, OPTION_ENABLE_IMPOSSIBLE_CODITION, 
  OPTION_EDIT_MODE, OPTION_NONINVASIVE_TUTORIAL, OPTION_NO_KEYBOARD,
  OPTION_CONDITION} from '../core/repositories/OptionRepository';

@Component({
  selector: 'app-options-form',
  templateUrl: './options-form.component.html',
  styleUrls: ['./options-form.component.css']
})
export class OptionsFormComponent implements OnInit {
  @Input() submitButtonText!: string;
  @Output() callOnOptionSubmit: EventEmitter<any> = new EventEmitter();

  // general options
  optionSmartphone = false;
  optionEditMode = false;

  // tutorial options
  optionTutorial = false;
  optionNonInvasiveTutorial = false;
  notFirstTimeTutorial = false;

  // sound options
  optionMusic = false;
  optionSoundEffects = false;
  
  // QTE options
  optionCondition = false;
  optionImpossibleCondition = false;
  optionNoKeyboard = false;

  constructor() { }

  ngOnInit() {
    this.notFirstTimeTutorial = TutorialService.load();
    this.optionTutorial = OptionRepository.getOption(OPTION_TUTORIAL);
    this.optionSmartphone = OptionRepository.getOption(OPTION_SMARTPHONE);
    this.optionCondition = OptionRepository.getOption(OPTION_CONDITION);
    this.optionEditMode = OptionRepository.getOption(OPTION_EDIT_MODE);
    this.optionMusic = OptionRepository.getOption(OPTION_MUSIC);
    this.optionSoundEffects = OptionRepository.getOption(OPTION_SOUND_EFFECTS);
    this.optionImpossibleCondition = OptionRepository.getOption(OPTION_ENABLE_IMPOSSIBLE_CODITION);
    this.optionNonInvasiveTutorial = OptionRepository.getOption(OPTION_NONINVASIVE_TUTORIAL);
    this.optionNoKeyboard = OptionRepository.getOption(OPTION_NO_KEYBOARD);
  }

  onDeleteTutorial() {
    TutorialService.delete();
    this.notFirstTimeTutorial = false;
  }

  onGameOptionsSubmit() {
    if (this.optionSmartphone) {
      this.optionNoKeyboard = true;
    }
    if (!this.optionCondition) {
      this.optionImpossibleCondition = false;
      this.optionNoKeyboard = false;
    }

    OptionRepository.setOption(OPTION_TUTORIAL, this.optionTutorial);
    OptionRepository.setOption(OPTION_SMARTPHONE, this.optionSmartphone);
    OptionRepository.setOption(OPTION_CONDITION, this.optionCondition);
    OptionRepository.setOption(OPTION_EDIT_MODE, this.optionEditMode);
    OptionRepository.setOption(OPTION_MUSIC, this.optionMusic);
    OptionRepository.setOption(OPTION_SOUND_EFFECTS, this.optionSoundEffects);
    OptionRepository.setOption(OPTION_ENABLE_IMPOSSIBLE_CODITION, this.optionImpossibleCondition);
    OptionRepository.setOption(OPTION_NONINVASIVE_TUTORIAL, this.optionNonInvasiveTutorial);
    OptionRepository.setOption(OPTION_NO_KEYBOARD, this.optionNoKeyboard);

    this.callOnOptionSubmit.emit();
  }

}
