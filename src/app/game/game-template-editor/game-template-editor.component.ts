import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { GameTemplate } from '../core/models/GameTemplate';

@Component({
  selector: 'app-game-template-editor',
  templateUrl: './game-template-editor.component.html',
  styleUrls: ['./game-template-editor.component.css']
})
export class GameTemplateEditorComponent implements OnInit {

  @Input() template!: GameTemplate;

  @Output() callOnEditPlay: EventEmitter<any> = new EventEmitter();
  @Output() callOnPersist: EventEmitter<any> = new EventEmitter();
  @Output() callOnDelete: EventEmitter<any> = new EventEmitter();

  isReadyToBePublished = false;
  isReadyToAddStoryContent = false;

  storyTitleAndMore = false;
  playerCharacterPool = false;
  otherCharacterPool = false;

  editorPage = 0;

  justSaved = false;
  showRememberToSave = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.checkTemplate();
  }

  onBack(): void {
    this.checkTemplate();
    this.editorPage = 0;
    this.justSaved = false;
    this.showRememberToSave = false;
  }

  onAddStoryContent(): void {
    this.callOnEditPlay.emit();
  }

  onSave(): void {
    this.callOnPersist.emit();
    this.justSaved = true;
    this.showRememberToSave = false;
  }
  
  onPersist(event$: any) {
    this.callOnPersist.emit();
  }

  onDelete(event$: any) {
    this.callOnDelete.emit();
  }

  onExit(): void {
    if (!this.justSaved && !this.showRememberToSave) {
      this.showRememberToSave = true;
    } else {
      // route away, without saving
      this.router.navigateByUrl('welcome');
    }
  }

  private checkTemplate() {
    this.storyTitleAndMore = this.template.name !== undefined && this.template.name.length > 0
      && this.template.description !== undefined && this.template.description.length > 0;
    
    this.playerCharacterPool = this.template.player !== undefined && this.template.player.isValid();
    this.otherCharacterPool = this.template.other !== undefined && this.template.other.isValid();
    
    this.isReadyToAddStoryContent = this.storyTitleAndMore && this.playerCharacterPool && this.otherCharacterPool;
    this.isReadyToBePublished = this.storyTitleAndMore && this.playerCharacterPool && this.otherCharacterPool;
  }

}
