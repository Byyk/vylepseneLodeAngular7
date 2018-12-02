import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';

import { HomeComponent } from './home/home.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireMessagingModule } from '@angular/fire/messaging';

import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { CanDeactivateGuard } from "./guards/can-deactivate.guard";
import { DiscardDialogComponent } from './discard-dialog/discard-dialog.component';
import { MatchMakingComponent } from './match-making/match-making.component';
import { MatchMakingService } from "./services/match-making.service";
import { ProfileImageComponent } from './profile/profile-image/profile-image.component';
import { LobbyComponent } from './match-making/lobby/lobby.component';
import { MenuComponent } from './match-making/menu/menu.component';
import { CreateGameComponent } from './match-making/menu/create-game/create-game.component';
import { JoinGameComponent } from './match-making/menu/join-game/join-game.component';
import { CircleButtonComponent } from './circle-button/circle-button.component';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './modules/app-routing.module';
import { MaterialModule } from './modules/material.module';
import { MatDialog } from '@angular/material';
import { AppFontAwesomeModule } from './modules/app-font-awesome.module';
import { ConfirmResetComponent } from './confirm-reset/confirm-reset.component';
import { PasswordDialogComponent } from './password-dialog/password-dialog.component';
import { MessageContainerComponent } from './messages/message-container.component';
import { MessageComponent } from './messages/message/message.component';
import {CookieService} from 'ngx-cookie-service';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        HomeComponent,
        LoginComponent,
        ProfileComponent,
        DiscardDialogComponent,
        MatchMakingComponent,
        ProfileImageComponent,
        LobbyComponent,
        MenuComponent,
        CreateGameComponent,
        JoinGameComponent,
        CircleButtonComponent,
        ConfirmResetComponent,
        PasswordDialogComponent,
        MessageContainerComponent,
        MessageComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MaterialModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireStorageModule,
        AngularFireMessagingModule,
        AppFontAwesomeModule
    ],
    providers: [
        CanDeactivateGuard,
        MatchMakingService,
        CookieService,
        MatDialog
    ],
    entryComponents: [
        DiscardDialogComponent,
        PasswordDialogComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
