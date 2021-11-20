import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Character, STRING_CHARACTER_GENDER } from '../core/models/Character';
import { CharacterRepository } from '../core/repositories/CharacterRepository';

@Component({
  selector: 'app-character-creator',
  templateUrl: './character-creator.component.html',
  styleUrls: ['./character-creator.component.css']
})
export class CharacterCreatorComponent implements OnInit {

  @Input() character!: Character;
  @Input() pollName!: string;
  @Input() submitButtonText!: string;
  @Output() callOnSubmit: EventEmitter<any> = new EventEmitter();

  genders = STRING_CHARACTER_GENDER;
  selectedGender!: string;
  shortDesc!: string;
  offensiveDesc!: string;

  constructor() {}

  onReRoll(isEmpty ?: boolean) {
    let char: Character;
    if (isEmpty) {
      char = CharacterRepository.getEmptyChar();
    } else {
      char = CharacterRepository.getRandom(this.pollName);
    }

    this.character.id = char.id;
    this.character.name = char.name;
    this.character.fullDesc = char.fullDesc;
    this.character.shortDesc = char.shortDesc;
    this.character.gender = char.gender;
    this.character.offensiveDesc = char.offensiveDesc;

    this.selectedGender = this.character.getGender();
    this.shortDesc = this.character.shortDesc.join('\r\n');
    this.offensiveDesc = this.character.offensiveDesc.join('\r\n');
  }

  ngOnInit() {
    if (!this.character.name || this.character.name === '') {
      this.onReRoll(true);
    }
    this.selectedGender = this.character.getGender();
    this.shortDesc = this.character.shortDesc.join('\r\n');
    this.offensiveDesc = this.character.offensiveDesc.join('\r\n');
  }

  onSubmit() {
    this.character.setGender(this.selectedGender);
    const shortDescs = this.shortDesc.split(/\r?\n/);
    const offensiveDescs = this.offensiveDesc.split(/\r?\n/);
    this.character.shortDesc = new Array(...shortDescs);
    this.character.offensiveDesc = new Array(...offensiveDescs);

    this.callOnSubmit.emit(this.character);
  }

}
