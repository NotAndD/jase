import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { GamePageComponent } from './game-page/game-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { GameChoiceComponent } from './game-choice/game-choice.component';
import { CharacterCreatorComponent } from './game/character-creator/character-creator.component';
import { GameCreatorComponent } from './game/game-creator/game-creator.component';
import { GameExecutionerComponent } from './game/game-executioner/game-executioner.component';
import { GameMessageComponent } from './game/game-message/game-message.component';
import { GameActionAreaComponent } from './game/game-action-area/game-action-area.component';
import { GameActionEditComponent } from './game/game-action-edit/game-action-edit.component';
import { GameReviewerComponent } from './game/game-reviewer/game-reviewer.component';
import { GameActionCreatorComponent } from './game/game-action-creator/game-action-creator.component';
import { GameActionContentEditComponent } from './game/game-action-content-edit/game-action-content-edit.component';
import { FatalityTesterComponent } from './game/fatality-tester/fatality-tester.component';
import { ConditionHandlerComponent } from './game/condition-handler/condition-handler.component';
import { OptionsFormComponent } from './game/options-form/options-form.component';
import { GamePauserComponent } from './game/game-pauser/game-pauser.component';
import { GameActionResultEditComponent } from './game/game-action-result-edit/game-action-result-edit.component';
import { GameLoaderComponent } from './game/game-loader/game-loader.component';
import { GameEditorChoiceComponent } from './game-editor-choice/game-editor-choice.component';
import { CreditsPageComponent } from './credits-page/credits-page.component';
import { GameEditorComponent } from './game-editor/game-editor.component';
import { GameTemplateEditorComponent } from './game/game-template-editor/game-template-editor.component';
import { GeneralEditorComponent } from './game/game-template-editor/general-editor/general-editor.component';
import { CharacterPoolCreatorComponent } from './game/character-pool-creator/character-pool-creator.component';
import { LogEditorComponent } from './game/game-template-editor/log-editor/log-editor.component';
import { MessagesEditorComponent } from './game/game-template-editor/messages-editor/messages-editor.component';
import { PersonalizationEditorComponent } from './game/game-template-editor/personalization-editor/personalization-editor.component';
import { ManageEditorComponent } from './game/game-template-editor/manage-editor/manage-editor.component';
import { GameTemplateLoaderComponent } from './game/game-template-loader/game-template-loader.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    GamePageComponent,
    PageNotFoundComponent,
    GameChoiceComponent,
    CharacterCreatorComponent,
    GameCreatorComponent,
    GameExecutionerComponent,
    GameMessageComponent,
    GameActionAreaComponent,
    GameActionEditComponent,
    GameReviewerComponent,
    GameActionCreatorComponent,
    GameActionContentEditComponent,
    FatalityTesterComponent,
    ConditionHandlerComponent,
    OptionsFormComponent,
    GamePauserComponent,
    GameActionResultEditComponent,
    GameLoaderComponent,
    GameEditorChoiceComponent,
    CreditsPageComponent,
    GameEditorComponent,
    GameTemplateEditorComponent,
    GeneralEditorComponent,
    CharacterPoolCreatorComponent,
    LogEditorComponent,
    MessagesEditorComponent,
    PersonalizationEditorComponent,
    ManageEditorComponent,
    GameTemplateLoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
