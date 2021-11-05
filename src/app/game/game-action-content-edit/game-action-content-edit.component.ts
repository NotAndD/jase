import { Component, OnInit, Output, Input, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Paragraph } from '../core/models/Paragraph';

@Component({
  selector: 'app-game-action-content-edit',
  templateUrl: './game-action-content-edit.component.html',
  styleUrls: ['./game-action-content-edit.component.css']
})
export class GameActionContentEditComponent implements OnInit {
  @Input() newPar!: Paragraph;
  @Output() callOnSubmit: EventEmitter<any> = new EventEmitter();
  @Output() callOnCancel: EventEmitter<any> = new EventEmitter();
  @ViewChild('text') textArea!: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  onCancel() {
    this.callOnCancel.emit();
  }

  onSubmit() {
    this.callOnSubmit.emit(this.newPar);
  }

  onBtnAdd(text: string, otherText?: string) {
    const selStart = this.textArea.nativeElement.selectionStart;
    const selEnd = this.textArea.nativeElement.selectionEnd;
    this.textArea.nativeElement.focus();

    if (selStart !== undefined && selEnd !== undefined) {
      if (otherText) {
        this.newPar.text = this.newPar.text.slice(0, selStart)
          + text + this.newPar.text.slice(selStart, selEnd)
          + otherText + this.newPar.text.slice(selEnd);
      } else {
        this.newPar.text = this.newPar.text.slice(0, selStart)
          + text + this.newPar.text.slice(selEnd);
      }

      const textAreaNative = this.textArea.nativeElement;
      setTimeout(() => {
        textAreaNative.setSelectionRange(selStart + text.length, selStart + text.length);
      }, 0);
    } else {
      this.newPar.text += text;
      if (otherText) {
        this.newPar.text += otherText;
      }
    }
  }

}
