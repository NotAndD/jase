import { Component, Input, OnInit } from '@angular/core';
import { Character, CharacterPoll } from '../core/models/Character';
import { CharacterRepository } from '../core/repositories/CharacterRepository';

@Component({
  selector: 'app-character-pool-creator',
  templateUrl: './character-pool-creator.component.html',
  styleUrls: ['./character-pool-creator.component.css']
})
export class CharacterPoolCreatorComponent implements OnInit {
  
  @Input() pool!: CharacterPoll;

  currentCharacter!: Character;
  showCharacterCreator = false;

  isAdd = false;
  isEdit = false;
  isCharacterSelected = false;

  constructor() { }

  ngOnInit(): void {
    this.showCharacterCreator = false;
    this.isAdd = false;
    this.isEdit = false;
    this.isCharacterSelected = false;
  }

  onCharacterSelect(character: Character) {
    this.isCharacterSelected = true;
    this.currentCharacter = character;
  }

  onCharacterDelete() {
    this.pool.characters = this.pool.characters.filter(c => c !== this.currentCharacter);
    this.isAdd = false;
    this.isEdit = false;
    this.isCharacterSelected = false;
  }

  onCharacterAdd() {
    this.isAdd = true;
    this.isEdit = false;
    this.isCharacterSelected = false;

    this.currentCharacter = new Character();
    CharacterRepository.loadCharacter([ this.pool ]);
    this.showCharacterCreator = true;
  }

  onCharacterEdit() {
    this.isAdd = false;
    this.isEdit = true;

    CharacterRepository.loadCharacter([ this.pool ]);
    this.showCharacterCreator = true;
  }

  onCharacterCreate(character: Character) {
    this.showCharacterCreator = false;

    if (this.isAdd) {
      this.currentCharacter = character;
      this.currentCharacter.id = this.pool.characters.length;
      this.pool.characters.push(this.currentCharacter);
    } else {
      const characterPosition = this.pool.characters.indexOf(this.currentCharacter);
      character.id = this.currentCharacter.id;
      this.currentCharacter = character;
      this.pool.characters[characterPosition] = this.currentCharacter;
    }
    this.isCharacterSelected = true;
  }

}
