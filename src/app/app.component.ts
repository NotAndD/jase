import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'just-another-story-engine';
  isCollapsed = false;
  router: Router;
  hideMenu = false;

  constructor(router: Router) {
    this.router = router;
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.hideMenu = event.url.startsWith('/game/');
      }
    });
  }
}
