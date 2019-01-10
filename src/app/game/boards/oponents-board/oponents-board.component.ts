import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Point, PoleModel, StavPole} from '../../../model/pole.model';
import {Field, GameService} from '../../../services/game.service';
import {AbilityData} from '../../../model/my-board.model';
import {filter, first} from 'rxjs/operators';

@Component({
    selector: 'app-oponents-board',
    templateUrl: './oponents-board.component.html',
    styleUrls: ['./oponents-board.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OponentsBoardComponent implements OnInit {
    public poles = new Array<PoleModel>();
    public stavPole = StavPole;
    private pointLastHovered: Point = {x: -1, y: -1};


    private actualRocket: AbilityData;

    @ViewChild('list')
    public list: ElementRef<HTMLDivElement>;

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
    ngOnInit() {}
    getHeight(){
        return this.list.nativeElement.offsetHeight;
    }
    clicked(event: MouseEvent) {
        console.log(event);
    }
    hover(event: MouseEvent) {
        /*this.poles.forEach(_pole => _pole.hover = false);
        this.actualRocket.pattern.forEach(point => {
            const soucetBodu = Point.Sum(point, pole.pozice);
            if(soucetBodu.x >= 0 && soucetBodu.x <= 20 && soucetBodu.y >= 0 && soucetBodu.y <= 20)
                this.poles[Point.toNumber(soucetBodu)].hover = true;
        });*/
        const x = Math.floor(event.offsetX / this.list.nativeElement.offsetHeight * 21);
        const y = Math.floor(event.offsetY / this.list.nativeElement.offsetHeight * 21);
        if(this.pointLastHovered.x === x && this.pointLastHovered.y === y) return;

        this.pointLastHovered.x = x;
        this.pointLastHovered.y = y;

        const arr = new Array<PoleModel>();
        this.actualRocket.pattern.forEach(point => {
            const soucetBodu = Point.Sum(point, {x: x, y: y});
            if(soucetBodu.x < 0 || soucetBodu.x > 20 || soucetBodu.y < 0 || soucetBodu.y > 20) return;
            arr.push({
                pozice: soucetBodu,
                state: StavPole.hover
            });
        });

        this.poles = arr;
    }
    mouseout() {
        this.poles = [];
    }
}
