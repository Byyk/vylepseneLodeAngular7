import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GameComponent} from "../game/game.component";
import {GameMenuComponent} from "../game/game-menu/game-menu.component";
import {GameMenuItemComponent} from "../game/game-menu/game-menu-item/game-menu-item.component";
import {GameSecondaryMenuComponent} from "../game/game-menu/game-secondary-menu/game-secondary-menu.component";
import {GameMenuItemTierComponent} from "../game/game-menu/game-menu-item/game-menu-item-tier/game-menu-item-tier.component";
import {GameSecondaryMenuItemComponent} from "../game/game-menu/game-secondary-menu/game-secondary-menu-item/game-secondary-menu-item.component";
import {MyBoardComponent} from "../game/boards/my-board/my-board.component";
import {OponentsBoardComponent} from "../game/boards/oponents-board/oponents-board.component";
import {MaterialModule} from "./material.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {AppComponent} from "../app.component";

@NgModule({
    declarations: [
        GameComponent,
        GameMenuComponent,
        GameMenuItemComponent,
        GameMenuItemTierComponent,
        GameSecondaryMenuComponent,
        GameSecondaryMenuItemComponent,

        MyBoardComponent,
        OponentsBoardComponent
    ],
    exports: [
        GameComponent,
        GameMenuComponent,
        GameMenuItemComponent,
        GameMenuItemTierComponent,
        GameSecondaryMenuComponent,
        GameSecondaryMenuItemComponent,

        MyBoardComponent,
        OponentsBoardComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FontAwesomeModule
    ],
    bootstrap: [AppComponent]
})
export class GameModule {
}
