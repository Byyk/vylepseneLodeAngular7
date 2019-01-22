import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatchMakingComponent} from './match-making.component';
import {MenuComponent} from './menu/menu.component';
import {LobbyComponent} from './lobby/lobby.component';
import {CreateGameComponent} from './menu/create-game/create-game.component';
import {GameModule} from '../game/game.module';
import {JoinGameComponent} from './menu/join-game/join-game.component';
import {PasswordDialogComponent} from '../password-dialog/password-dialog.component';
import {TabsContainerComponent} from './lobby/tabs/tabs-container/tabs-container.component';
import {TabsComponent} from './lobby/tabs/tabs.component';
import {TabsNavComponent} from './lobby/tabs/tabs-nav/tabs-nav.component';
import {TabComponent} from './lobby/tabs/tabs-nav/tab/tab.component';
import {ChatComponent} from './lobby/tabs/chat/chat.component';
import {RequestsComponent} from './lobby/tabs/requests/requests.component';
import {ChatMessageComponent} from './lobby/tabs/chat/message/message.component';
import {MaterialModule} from '../modules/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SliderComponent} from './lobby/tabs/tabs-nav/slider/slider.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
    declarations: [
        MatchMakingComponent,
        MenuComponent,
        LobbyComponent,
        CreateGameComponent,
        JoinGameComponent,
        PasswordDialogComponent,
        TabsContainerComponent,
        TabsComponent,
        TabsNavComponent,
        TabComponent,
        ChatComponent,
        RequestsComponent,
        ChatMessageComponent,
        SliderComponent
    ],
    imports: [
        CommonModule,
        GameModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        FontAwesomeModule
    ],
    exports: [
        MatchMakingComponent
    ]
})
export class MatchMakingModule { }
