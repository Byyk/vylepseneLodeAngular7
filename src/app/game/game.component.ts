import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {emitors, Field, Gs2Service} from '../services/gs2.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements OnInit {
    public loading: Observable<boolean>;
    public rozmisteno: Observable<boolean>;
    public Field = Field;

    constructor(
        public gs2: Gs2Service
    ) {
        this.loading = this.gs2.storage.getEmitor(emitors.match_ready);
        this.rozmisteno = this.gs2.storage.getEmitor(emitors.rozmisteno);
    }

    ngOnInit() {
    }

}
