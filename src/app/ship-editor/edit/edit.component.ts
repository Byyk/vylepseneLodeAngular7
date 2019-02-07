import {AfterContentChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PatternEditorData} from "../model/pattern-editor-data";
import {BehaviorSubject} from "rxjs";

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

    showVelikostmenu = new BehaviorSubject(false);
    showPatternEditor = new BehaviorSubject(false);

    patternEditorData: PatternEditorData;

    @ViewChild('velikostMenu')
    public velikostMenu: ElementRef<HTMLDivElement>;

    patternEdditorSikmo = false;

    constructor(
        public cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.patternEditorData = {
            Rovne: {x: 1, y: 1},
            Sikmo: {x: 1, y: 1}
        };
    }

    switchMode(is: boolean) {
        this.patternEdditorSikmo = is;
    }

    ShowVelikostmenu() {
        this.showVelikostmenu.next(true);
    }

    VelikostMenuSubmited(patternEditorData: PatternEditorData) {
        this.patternEditorData = patternEditorData;
        this.showVelikostmenu.next(false);
        this.showPatternEditor.next(true);
        this.cdr.markForCheck();
    }

    closed() {
        this.showVelikostmenu.next(false);
        this.cdr.markForCheck();
    }
}


