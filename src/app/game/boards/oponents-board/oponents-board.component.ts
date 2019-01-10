import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Point, PoleModel, StavPole} from '../../../model/pole.model';
import {Field, GameService} from '../../../services/game.service';
import {AbilityData} from '../../../model/my-board.model';
import {filter, first} from "rxjs/operators";

@Component({
    selector: 'app-oponents-board',
    templateUrl: './oponents-board.component.html',
    styleUrls: ['./oponents-board.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OponentsBoardComponent implements OnInit {
    public poles = new Array<PoleModel>();

    private actualRocket: AbilityData;

    @ViewChild('list')
    public list: ElementRef;

    constructor(
        public gs: GameService,
        private cdr: ChangeDetectorRef
    ) {
        this.actualRocket = {name: "1x1", icon: "",cost: 0, pattern: [{x: 0, y: 0}]};
        this.gs.actualWeapon.subscribe(weapon => this.actualRocket = weapon);
        this.gs.actualField.pipe(
            filter(field => field === Field.enemyField),
            first()
        ).subscribe(() => this.cdr.markForCheck());
    }
    ngOnInit() {
    }
    getHeight(){
        return this.list.nativeElement.offsetHeight + 'px';
    }
    poleclicked(pole: PoleModel) {

    }
    hover(event) {
        /*this.poles.forEach(_pole => _pole.hover = false);
        this.actualRocket.pattern.forEach(point => {
            const soucetBodu = Point.Sum(point, pole.pozice);
            if(soucetBodu.x >= 0 && soucetBodu.x <= 20 && soucetBodu.y >= 0 && soucetBodu.y <= 20)
                this.poles[Point.toNumber(soucetBodu)].hover = true;
        });*/
        console.log(event);
    }
    mouseout() {
        this.poles.forEach(pole => pole.hover = false);
    }
}
