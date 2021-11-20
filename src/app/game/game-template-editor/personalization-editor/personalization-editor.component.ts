import { Component, Input, OnInit } from '@angular/core';
import { GameTemplate } from '../../core/models/GameTemplate';

@Component({
  selector: 'app-personalization-editor',
  templateUrl: './personalization-editor.component.html',
  styleUrls: ['./personalization-editor.component.css']
})
export class PersonalizationEditorComponent implements OnInit {

  @Input() template!: GameTemplate;

  constructor() { }

  ngOnInit(): void {
  }

}
