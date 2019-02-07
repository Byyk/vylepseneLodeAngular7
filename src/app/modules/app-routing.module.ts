import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from '../login/login.component';
import {ProfileComponent} from '../profile/profile.component';
import {MatchMakingComponent} from '../match-making/match-making.component';
import {HomeComponent} from '../home/home.component';
import {CanActivateGuard} from '../guards/can-activate.guard';
import {CanDeactivateGuard} from '../guards/can-deactivate.guard';
import {CanNotActivateGuard} from '../guards/can-not-activate.guard';
import {ConfirmResetComponent} from '../confirm-reset/confirm-reset.component';
import {ShipEditorModule} from "../ship-editor/ship-editor.module";


const routes: Routes = [
    {path: 'Login', component: LoginComponent, canActivate: [CanNotActivateGuard]},
    {path: 'profile', component: ProfileComponent, canDeactivate: [CanDeactivateGuard], canActivate: [CanActivateGuard]},
    {path: 'match-making', component: MatchMakingComponent, canActivate: [CanActivateGuard]},
    {path: 'reset-password', component: ConfirmResetComponent, canActivate: [CanNotActivateGuard]},
    {path: 'ship-editor', loadChildren: () => ShipEditorModule},
    {path: 'match-making', component: MatchMakingComponent, canActivate: [CanActivateGuard]},
    {path: 'reset-password', component: ConfirmResetComponent, canActivate: [CanNotActivateGuard]},
    {path: 'game', loadChildren: '../game/game.module#GameModule'},
    {path: '**', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
