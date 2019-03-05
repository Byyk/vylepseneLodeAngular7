import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PatternEditorData} from "../../model/pattern-editor-data";

@Component({
  selector: 'app-velikost-menu',
  templateUrl: './velikost-menu.component.html',
  styleUrls: ['./velikost-menu.component.scss']
})
export class VelikostMenuComponent implements OnInit {

  @Input()
  public patternEditorData: PatternEditorData;

  @Output()
  public submited = new EventEmitter<PatternEditorData>();

  @Output()
  public closed = new EventEmitter();

  constructor(
      private thisC: ElementRef
  ) { }

  ngOnInit() {
  }

  submit() {
    this.submited.emit(this.patternEditorData);
  }

  close() {
    this.closed.emit();
    (document.querySelector('') as HTMLElement).style.top = '150px';
  }

}
