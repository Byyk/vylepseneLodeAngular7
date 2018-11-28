import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-circle-button',
  templateUrl: './circle-button.component.html',
  styleUrls: ['./circle-button.component.css']
})
export class CircleButtonComponent{
  @Input()
  public text: string;

  @Input()
  public disabled: boolean;

  @Output()
  public click = new EventEmitter();

  @Input()
  public fullWidth: boolean;

  constructor() {
  }

  Click(){
    this.click.emit(null);
  }
}
