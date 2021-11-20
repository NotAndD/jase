import { Component, Input, OnInit } from '@angular/core';
import { GameTemplate } from '../../core/models/GameTemplate';

@Component({
  selector: 'app-general-editor',
  templateUrl: './general-editor.component.html',
  styleUrls: ['./general-editor.component.css']
})
export class GeneralEditorComponent implements OnInit {

  @Input() template!: GameTemplate;

  constructor() { }

  ngOnInit(): void {
  }

}
