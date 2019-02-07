import {Component, OnInit} from '@angular/core';
import {EditorService} from "../editor.service";

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

    constructor(
        public es: EditorService
    ) {
    }

    ngOnInit() {
    }

    edit(uid: string) {

    }

    delete(uid: string) {

    }

}
