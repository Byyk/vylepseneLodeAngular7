import { Component, Input } from '@angular/core';

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

  @Input()
  public click: () => void;

  constructor() {
    this.click = () => {};
  }
}
