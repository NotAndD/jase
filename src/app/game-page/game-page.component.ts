import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameEngine } from '../game/core/engine/GameEngine';
import { GameTemplateRepository } from '../game/core/repositories/GameTemplateRepository';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.css']
})
export class GamePageComponent implements OnInit, OnDestroy {

  gamePhase = -1;
  templateId!: string;
  gameEngine!: GameEngine;
  routeSubscription?: Subscription;

  isAvailableLocally = false;
  isAvailableForDownload = false;
  isNoGameTemplateAvailable = false;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.routeSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      if (params.templateId) {
        this.initGame(params.templateId);
      }
    });
  }

  private initGame(routeTemplateId: string) {
    this.templateId = routeTemplateId;
    GameTemplateRepository.initFromLocal();
    this.isAvailableLocally = GameTemplateRepository.isLocallyAvailable(this.templateId, false);

    // TODO check if new version is available
    // - if it is and there is a local version, propose to update the game
    // - if it is and there is no local version, download it
    // - if there is no new version but there is a local version, use the local one
    // - if there is no local version and nothing to download, state the error and propose to go to game-choice

    if (this.isAvailableLocally) {
      this.gameEngine = new GameEngine(this.templateId);
      this.gamePhase = 0;
    } else {
      this.isNoGameTemplateAvailable = true;
    }
  }

  onStartGame(engine: GameEngine) {
    this.gameEngine = engine;

    this.gameEngine.startGame();
    this.gamePhase = 1;
  }

  onEndGame(engine: GameEngine) {
    this.gameEngine = engine;
    this.gameEngine.stopGame();

    this.gamePhase = 2;
  }

  onExploreAgain(event: any) {
    if (this.templateId) {
      this.gameEngine = new GameEngine(this.templateId);
      this.gamePhase = 0;
    }
  }
}
