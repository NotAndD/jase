import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameTemplate } from '../game/core/models/GameTemplate';
import { GameTemplateRepository } from '../game/core/repositories/GameTemplateRepository';

@Component({
  selector: 'app-game-choice',
  templateUrl: './game-choice.component.html',
  styleUrls: ['./game-choice.component.css']
})
export class GameChoiceComponent {

  localSearch = false;
  storyIdInput = false;
  storyId?: string;

  isStoryIdAvailable = false;
  lastStoryIdUsed?: string;

  constructor(private router: Router) { }

  showLocalSearch(): void {
    this.localSearch = true;
    this.storyIdInput = false;

    this.storyId = undefined;
  }

  showStoryIdInput(): void {
    this.localSearch = false;
    this.storyIdInput = true;
  }

  onLocalTemplateChoice($event: any): void {
    this.router.navigateByUrl('/game/' + $event);
  }

  onStoryIdSubmit(): void {
    if (!this.storyId) {
      // impossible
      return;
    }

    if (GameTemplateRepository.isLocallyAvailable(this.storyId, false)) {
      this.isStoryIdAvailable = true;
    } else {
      // TODO check if the game template can be downloaded or not 
      // - if it can, the story is available
      // - if it cannot, state that the id does not work and propose to search again
    }

    if (this.isStoryIdAvailable) {
      this.router.navigateByUrl('/game/' + this.storyId);
    } else {
      this.lastStoryIdUsed = this.storyId;
    }
  }

  isValidForSearch(): boolean {
    if (!this.storyId || this.storyId === this.lastStoryIdUsed) {
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
