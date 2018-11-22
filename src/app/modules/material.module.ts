import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatMenuModule,
    MatCardModule,
    MatDialogModule,
} from '@angular/material';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatGridListModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatPaginatorModule,
        MatSelectModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        MatExpansionModule,
        MatMenuModule,
        MatCardModule,
        MatDialogModule,
        LayoutModule,
        BrowserAnimationsModule,
    ],
    exports: [
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatGridListModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatPaginatorModule,
        MatSelectModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        MatExpansionModule,
        MatMenuModule,
        MatCardModule,
        MatDialogModule,
        LayoutModule,
        BrowserAnimationsModule,
    ]
})
export class MaterialModule { }
