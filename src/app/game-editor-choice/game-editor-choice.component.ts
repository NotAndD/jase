import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameTemplate } from '../game/core/models/GameTemplate';
import { GameTemplateRepository } from '../game/core/repositories/GameTemplateRepository';

@Component({
  selector: 'app-game-editor-choice',
  templateUrl: './game-editor-choice.component.html',
  styleUrls: ['./game-editor-choice.component.css']
})
export class GameEditorChoiceComponent {

  isEdit = false;
  isCreate = false;
  storyId?: string;
  storyIdInput!: boolean;
  localSearch!: boolean;

  lastStoryIdUsed?: string;

  constructor(private router: Router) { }

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
  }

  onStoryIdSubmit() {
    if (!this.storyId || !this.isValidForSubmit()) {
      // impossible
      return;
    }

    if (this.isCreate) {
      this.onStoryIdSubmitForCreate();
    } else if (this.isEdit) {
      this.onStoryIdSubmitForEdit();
    }
  }

  showStoryIdInput() {
    this.storyIdInput = true;
    this.localSearch = false;
  }

  showLocalSearch() {
    this.storyIdInput = false;
    this.localSearch = true;
  }

  onLocalTemplateChoice($event: any): void {
    this.router.navigateByUrl('/game-editor/' + $event);
  }

  private onStoryIdSubmitForCreate() {
    if (!this.storyId) {
      // impossible
      return;
    }
    // TODO try if the story-id is available
    // - if it is, create a new wip story for the author, then redirect to game-editor
    // - if it is not, state the problem and force the author to change the story id

    if (!GameTemplateRepository.isLocallyAvailable(this.storyId, true)) {
      const newTemplate = new GameTemplate();
      newTemplate.id = this.storyId;
      newTemplate.wip = true;

      GameTemplateRepository.add(newTemplate);
    }

    this.router.navigateByUrl('/game-editor/' + this.storyId);
  }

  private onStoryIdSubmitForEdit() {
    if (!this.storyId) {
      // impossible
      return;
    }
    // TODO try if the story-id is already present on the server
    // - if it is and the author id match, redirect to the game-editor
    // - if it is but the author id does not match OR if it is not available,
    //     state the problem and force the author to change the author id

    if (!GameTemplateRepository.isLocallyAvailable(this.storyId, true)) {
      // try to download it and such
    } else {
      this.router.navigateByUrl('/game-editor/' + this.storyId);
    }
  }

  isValidForSubmit(): boolean {
    if (!this.storyId) {
      return false;
    }

    if (this.storyId.length < 8) {
      return false;
    }

    const storyIdRegEx = new RegExp(/[^a-zA-Z0-9\-]+/, 'g');
    const matches = this.storyId.match(storyIdRegEx);
    if (matches && matches.length> 0) {
      return false;
    }

    return true;
  }

}
