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

  localTemplates: GameTemplate[] = [];
  templateSelected?: GameTemplate;
  localSearch = false;
  storyIdInput = false;
  storyId?: string;

  constructor(private router: Router) { }

  showLocalSearch(): void {
    this.localSearch = true;
    this.storyIdInput = false;

    this.localTemplates = GameTemplateRepository.list();
  }

  showStoryIdInput(): void {
    this.localSearch = false;
    this.storyIdInput = true;
  }

  onLocalTemplateChoice(): void {
    if (!this.templateSelected) {
      // impossible
      return;
    }

    this.router.navigateByUrl('/game/' + this.templateSelected.id);
  }

  onStoryIdSubmit(): void {
    if (!this.storyId) {
      // impossible
      return;
    }

    GameTemplateRepository.downloadTemplate(this.storyId);
    this.router.navigateByUrl('/game/' + this.storyId);
  }

}
