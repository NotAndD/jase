import { Component, OnInit } from '@angular/core';
import { TipService } from './home-page-tips.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor() { }

  showTips = true;
  currTipText!: string;

  ngOnInit() {
    this.currTipText = TipService.getNextTip();
  }

  onNextTips() {
    this.currTipText = TipService.getNextTip();
  }
}
