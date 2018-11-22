import { Breakpointy } from "../../model/breakpoints.model";
import { BreakpointObserver } from "@angular/cdk/layout";
import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent extends Breakpointy {

    constructor(
        public bpo: BreakpointObserver
    )
    { super(bpo); }

}
