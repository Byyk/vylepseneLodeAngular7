import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TableComponent} from './table/table.component';
import {RouterModule, Routes} from "@angular/router";
import {
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatGridList, MatInputModule,
    MatTableModule,
    MatToolbarModule
} from "@angular/material";
import { EditComponent } from './edit/edit.component';
import { PatternEditorComponent } from './edit/pattern-editor/pattern-editor.component';
import { VelikostMenuComponent } from './edit/velikost-menu/velikost-menu.component';
import {FormsModule} from "@angular/forms";

const routes: Routes = [
    {path: 'add', component: EditComponent},
    {path: '**', component: TableComponent}
];

@NgModule({
    declarations: [TableComponent, EditComponent, PatternEditorComponent, VelikostMenuComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatTableModule,
        MatButtonModule,
        MatCardModule,
        MatToolbarModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule
    ]
})
export class ShipEditorModule {
}
