import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { GamePageComponent } from './game-page/game-page.component';
import { GameChoiceComponent } from './game-choice/game-choice.component';
import { GameEditorChoiceComponent } from './game-editor-choice/game-editor-choice.component';
import { GameEditorComponent } from './game-editor/game-editor.component';
import { CreditsPageComponent } from './credits-page/credits-page.component';

const routes: Routes = [
  { path: 'welcome', component: HomePageComponent },

  { path: 'game-choice', component: GameChoiceComponent },
  { path: 'game-editor-choice', component: GameEditorChoiceComponent },

  { path: 'game/:templateId', component: GamePageComponent },
  { path: 'game-editor/:templateId', component: GameEditorComponent },

  { path: 'credits', component: CreditsPageComponent },

  { path: '', redirectTo: '/welcome', pathMatch: 'full'},
  { path: 'index', redirectTo: '/welcome', pathMatch: 'full'},

  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
