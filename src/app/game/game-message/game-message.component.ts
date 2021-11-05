import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MessageParagraph } from '../core/models/MessageParagraph';
import { INNER_EXTERNAL_SEPARATOR, INNER_INTERNAL_SEPARATOR } from '../core/services/ParagraphService';

interface GameMessagePiece {
  type: number;
  content: string;
  goTo?: number;
}

@Component({
  selector: 'app-game-message',
  templateUrl: './game-message.component.html',
  styleUrls: ['./game-message.component.css']
})
export class GameMessageComponent implements OnInit, OnChanges {
  @Input() paragraph!: MessageParagraph;
  @Input() isLastOne!: boolean;
  @Output() callOnInnerChoice: EventEmitter<any> = new EventEmitter();

  title!: string;
  text!: string;
  author?: string;

  messagePieces!: Array<GameMessagePiece>;

  constructor() { }


  ngOnInit() {
    this.setUp();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isLastOne.currentValue !== changes.isLastOne.previousValue) {
      this.setUp();
    }
  }

  onClick(id: number | undefined) {
    this.callOnInnerChoice.emit(id);
  }

  private setUp() {
    this.messagePieces = [];
    this.title = this.paragraph.title;
    this.text = this.paragraph.text;
    this.author = this.paragraph.author;

    if (this.paragraph.innerSons) {
      const textPieces = this.paragraph.text.split(INNER_EXTERNAL_SEPARATOR);
      textPieces.forEach(piece => {
        this.messagePieces.push(this.makeButtonPiece(piece));
      });
    } else {
      this.messagePieces.push(this.makeTextPiece(this.text));
    }
  }

  private makeButtonPiece(content: string): GameMessagePiece {
    const pieces = content.split(INNER_INTERNAL_SEPARATOR);
    if (pieces.length === 2 && this.isLastOne) {
      return {
        type: 2,
        content: pieces[0],
        goTo: Number(pieces[1])
      };
    } else if (pieces.length === 2) {
      return this.makeTextPiece(pieces[0]);
    }
    return this.makeTextPiece(content);
  }

  private makeTextPiece(content: string): GameMessagePiece {
    return {
      type: 1,
      content
    };
  }

}
