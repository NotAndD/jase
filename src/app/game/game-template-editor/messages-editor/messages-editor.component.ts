import { Component, Input, OnInit } from '@angular/core';
import { GameTemplate } from '../../core/models/GameTemplate';

@Component({
  selector: 'app-messages-editor',
  templateUrl: './messages-editor.component.html',
  styleUrls: ['./messages-editor.component.css']
})
export class MessagesEditorComponent implements OnInit {

  @Input() template!: GameTemplate;

  currentMessage: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  onMessageDelete(idx: number) {
    this.template.pauseMessages.splice(idx, 1);
  }

  onMessageAdd() {
    this.template.pauseMessages.push(this.currentMessage);
    this.currentMessage = '';
  }

}
