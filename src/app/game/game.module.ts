import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GameComponent} from './game.component';
import {RouterModule, Routes} from '@angular/router';
import { BoardComponent } from './board/board.component';

const routes: Routes = [
    { path: 'play' , component: GameComponent}
];

@NgModule({
    declarations: [GameComponent, BoardComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class GameModule {
}
