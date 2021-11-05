import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameEngine } from '../game/core/engine/GameEngine';

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

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.routeSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      if (params.templateId) {
        this.templateId = params.templateId;
        this.gameEngine = new GameEngine(this.templateId);
        this.gamePhase = 0;
      }
    });
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
