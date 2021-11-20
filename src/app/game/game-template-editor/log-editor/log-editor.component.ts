import { Component, Input, OnInit } from '@angular/core';
import { GameTemplate } from '../../core/models/GameTemplate';

@Component({
  selector: 'app-log-editor',
  templateUrl: './log-editor.component.html',
  styleUrls: ['./log-editor.component.css']
})
export class LogEditorComponent implements OnInit {

  @Input() template!: GameTemplate;

  keySelected!: string;
  currentEntryKey!: string;
  currentEntryContent!: string;

  showEntryEditor = false;
  isAdd = false;
  isEdit = false;

  constructor() { }

  ngOnInit(): void {
    this.showEntryEditor = false;
  }

  onEntryAdd() {
    this.isAdd = true;
    this.isEdit = false;

    this.currentEntryKey = '';
    this.currentEntryContent = '';
    this.showEntryEditor = true;
  }

  onEntryEdit() {
    this.isAdd = false;
    this.isEdit = true;

    this.currentEntryKey = this.keySelected;
    this.currentEntryContent = this.template.logEntries[this.currentEntryKey].join('\n');
    this.showEntryEditor = true;
  }

  onEntryDelete() {
    this.showEntryEditor = false;
    delete this.template.logEntries[this.keySelected];
  }

  onEntryDone() {
    if (this.isEdit) {
      delete this.template.logEntries[this.keySelected];
    }

    this.template.logEntries[this.currentEntryKey] = this.currentEntryContent.split('\n');
    this.showEntryEditor = false;
  }

}
