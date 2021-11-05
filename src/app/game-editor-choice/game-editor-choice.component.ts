import { Component, OnInit } from '@angular/core';
import { GameTemplateRepository } from '../game/core/repositories/GameTemplateRepository';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

@Component({
  selector: 'app-game-editor-choice',
  templateUrl: './game-editor-choice.component.html',
  styleUrls: ['./game-editor-choice.component.css']
})
export class GameEditorChoiceComponent {

  isEdit = false;
  isCreate = false;
  storyId?: string;
  authorId?: string;

  constructor() { }

  showEdit() {
    this.isEdit = true;
    this.isCreate = false;

    // TODO check local templates but also provide the possibility to edit a new one
  }

  showCreate() {
    this.isEdit = false;
    this.isCreate = true;

    if (!this.storyId) {
      // generate a random, correct one
      this.storyId = GameTemplateRepository.getRandomTemplateId();
    }

    if (!this.authorId) {
      this.authorId = uuidv4();
    }
  }

  onStoryIdSubmit() {
    if (!this.storyId) {
      // impossible
      return;
    }

    // TODO, ensure you are not a bot here

    // TODO try if the story-id is available, if it is, create a partial GameTemplate, then redirect to the Template editor
  }

}
