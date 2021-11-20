import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GameTemplate } from '../../core/models/GameTemplate';

@Component({
  selector: 'app-manage-editor',
  templateUrl: './manage-editor.component.html',
  styleUrls: ['./manage-editor.component.css']
})
export class ManageEditorComponent implements OnInit {

  @Input() template!: GameTemplate;
  @Input() isReadyToBePublished!: boolean;
  
  @Output() callOnPersist: EventEmitter<any> = new EventEmitter();
  @Output() callOnDelete: EventEmitter<any> = new EventEmitter();

  showAreYouSurePublish = false;
  showAreYouSureUnPublish = false;
  showAreYouSureDelete = false;

  publishUrl!: string;

  constructor() { }

  ngOnInit(): void {
    this.publishUrl = window.location.origin + '/game/' + this.template.id;
  }

  onPublish() {
    if (this.isReadyToBePublished) {
      this.template.wip = false;

      this.callOnPersist.emit();
    }
    this.showAreYouSurePublish = false;
  }

  onUnPublish() {
    this.template.wip = true;

    this.callOnPersist.emit();
    this.showAreYouSureUnPublish = false;
  }

  onDelete() {
    this.callOnDelete.emit();
  }

}
