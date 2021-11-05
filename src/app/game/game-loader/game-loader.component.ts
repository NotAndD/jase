import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GameSlot } from '../core/models/GameSlot';
import { StorageHandler } from '../core/services/StorageService';
import { Game } from '../core/models/Game';

@Component({
  selector: 'app-game-loader',
  templateUrl: './game-loader.component.html',
  styleUrls: ['./game-loader.component.css']
})
export class GameLoaderComponent implements OnInit {

  @Input() templateId!: string;
  @Input() totalNumberOfPars!: number;
  @Input() totalTrueEndings!: number;

  @Output() callOnSlotChoise: EventEmitter<any> = new EventEmitter();

  slots!: GameSlot[];
  slotSelected?: GameSlot;

  errorOnImport = false;

  constructor() { }

  ngOnInit() {
    this.slots = StorageHandler.storageService.getGameSlots(this.templateId);
  }

  onSlotSelection(slot: GameSlot) {
    this.slotSelected = slot;
  }

  onSlotLoad() {
    if (!this.slotSelected) {
      return;
    }
    let game: Game;
    if (this.slotSelected.isEmpty) {
      game = new Game();
    } else {
      game = StorageHandler.storageService.loadGame(
        this.slotSelected.templateId, this.slotSelected.slot);
    }
    game.slot = this.slotSelected;
    this.callOnSlotChoise.emit(game);
  }

  onSlotLoadFromStart() {
    if (!this.slotSelected) {
      return;
    }
    const game = StorageHandler.storageService.loadGame(
      this.slotSelected.templateId, this.slotSelected.slot, true);
    game.slot = this.slotSelected;
    game.slot.resetToBeginning();

    this.callOnSlotChoise.emit(game);
  }

  onSlotDelete() {
    if (!this.slotSelected) {
      return;
    }
    StorageHandler.storageService.purgeSlot(
      this.slotSelected.templateId, this.slotSelected.slot);
    this.slots = StorageHandler.storageService.getGameSlots(this.templateId);
    this.slotSelected = undefined;
  }

  onSlotExport() {
    if (!this.slotSelected) {
      return;
    }
    const localGame = StorageHandler.storageService.getLocalGame(
      this.slotSelected.templateId, this.slotSelected.slot);
    if (localGame) {
      this.saveAsFile(localGame, this.slotToFileName(this.slotSelected));
    }
  }

  onSlotImport($event: any) {
    if (!this.slotSelected) {
      return;
    }
    if ($event && $event.target && $event.target.files && $event.target.files[0]) {
      const file = $event.target.files[0];
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        // here it should always be a string, hopefully
        this.fromFileContentToGame(fileReader.result as string);
      }
      fileReader.readAsText(file);
    }
  }

  private fromFileContentToGame(fileContent: string) {
    if (!this.slotSelected) {
      return;
    }
    try {
      StorageHandler.storageService.importGame(
        this.slotSelected.templateId, this.slotSelected.slot, fileContent);
      this.errorOnImport = false;
      this.slots = StorageHandler.storageService.getGameSlots(this.templateId);
    } catch (e) {
      this.errorOnImport = true;
    }
  }

  private saveAsFile(fileContent: string, fileName: string) {
    const a = document.createElement('a');
    const blob = new Blob([fileContent], { type: 'text/plain; charset=UTF-8' });
    const url = window.URL.createObjectURL(blob);
  
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  private slotToFileName(slot: GameSlot) {
    const pieces = [
      slot.templateId, slot.description.replace(/[^a-zA-Z0-9]/g,'_'),
      '_explored_', slot.exploration
    ]
    return pieces.join('_');
  }

}
