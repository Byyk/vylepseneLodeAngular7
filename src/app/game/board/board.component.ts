import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
// https://medium.com/front-end-weekly/dynamically-add-components-to-the-dom-with-angular-71b0cb535286
@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, AfterViewInit{
    ngAfterViewInit(): void {
        // this.board.nativeElement.childNodes.push('<div> aaa </div>');
        console.log(this.board.nativeElement.childNodes);
    }

    constructor(
        public board: ElementRef
    ) {}

    ngOnInit() {
    }

}
