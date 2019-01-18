import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(
        private http: HttpClient,
        private cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        const a = floor(1.0);
    }

    getRandomImage(): string {
        return `https://picsum.photos/${window.innerWidth}/300?random`;
    }
}
