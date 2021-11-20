import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameEngine } from '../game/core/engine/GameEngine';
import { GameTemplate } from '../game/core/models/GameTemplate';
import { ConditionRepository } from '../game/core/repositories/ConditionRepository';
import { GameTemplateRepository } from '../game/core/repositories/GameTemplateRepository';
import { ParagraphRepository } from '../game/core/repositories/ParagraphRepository';
import { ResultRepository } from '../game/core/repositories/ResultRepository';
import { StorageHandler } from '../game/core/services/StorageService';

@Component({
  selector: 'app-game-editor',
  templateUrl: './game-editor.component.html',
  styleUrls: ['./game-editor.component.css']
})
export class GameEditorComponent implements OnInit, OnDestroy {

  editPhase = -1;
  templateId!: string;
  template!: GameTemplate;
  routeSubscription?: Subscription;
  
  // used when playing the story in edit mode
  gameEngine!: GameEngine;
  gamePhase = 0;

  isLoading = true;
  isFailure = false;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.routeSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      if (params.templateId) {
        this.initEdit(params.templateId);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  onEditPlay(event: any): void {
    this.editPhase = 1;
    this.gamePhase = 0;
    this.gameEngine = new GameEngine(this.templateId);
  }

  onPersist(event: any): void {
    // TODO persist the template on cloud
    StorageHandler.storageService.saveTemplate(this.template);
  }

  onDelete(event: any): void {
    // TODO delete from cloud
  }

  private initEdit(routeTemplateId: string) {
    this.templateId = routeTemplateId;
    // TODO check if the game is available
    // - if it is and the owner / editor key saved locally match, download it up
    // - if there is no game or the owner / editor key saved locally does not match,
    //     state the problem and force the player back to game-editor-choice

    // if everything is ok
    this.editPhase = 0;
    this.template = GameTemplateRepository.get(this.templateId);
  }

  onStartGame(engine: GameEngine) {
    this.gameEngine = engine;

    this.gameEngine.startGame();
    this.gamePhase = 1;
  }

  onEndGame(engine: GameEngine) {
    this.gameEngine = engine;
    this.gameEngine.stopGame();
    this.populateTemplateFromGame();

    this.gamePhase = 0;
    this.editPhase = 0;
  }

  populateTemplateFromGame() {
    this.template.conditions = [...ConditionRepository.conditions];
    this.template.results = [...ResultRepository.results];
    this.template.paragraphs = [...ParagraphRepository.pars];
  }

}
