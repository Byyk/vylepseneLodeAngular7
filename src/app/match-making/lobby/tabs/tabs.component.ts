import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

    state = 1;
    public Stav = new BehaviorSubject(this.state);

    set State(value: number){
        this.state = value;
        this.Stav.next(value);
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                state: value
            },
            queryParamsHandling: "merge"
        });
    }

    constructor(
        public router: Router,
        public route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.queryParamMap.subscribe((params) => {
            this.state = params['state'] ? params['state'] : 1;
        });
    }

    stateChanged(number: number) {
        this.State = number;
    }
}
