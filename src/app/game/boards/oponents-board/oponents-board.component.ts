import {Component, OnInit, ViewChild} from '@angular/core';
import {Point, PoleModel, StavPole} from '../../../model/pole.model';
import {GameService} from '../../../services/game.service';
import {RaketaModel} from '../../../model/raketa.model';
import {AbilityData} from '../../../model/my-board.model';

@Component({
  selector: 'app-oponents-board',
  templateUrl: './oponents-board.component.html',
  styleUrls: ['./oponents-board.component.scss']
})
export class OponentsBoardComponent implements OnInit {
    public poles = new Array<PoleModel>();

    private actualRocket: AbilityData;

    @ViewChild('list')
    public list;

    constructor(
        public gs: GameService
    ) {
        for(let i = 0; i < 21; i++) {
            for(let j = 0; j < 21; j++){
                this.poles.push({pozice: {x: j, y: i}, state: StavPole.more, hover: false});
            }
        }

        this.actualRocket = {name: "1x1", icon: "",cost: 0, pattern: [{x: 0, y: 0}]};
        this.gs.actualWeapon.subscribe(weapon => this.actualRocket = weapon);
    }
    ngOnInit() {
    }
    getHeight(){
        return this.list._element.nativeElement.offsetHeight + 'px';
    }
    poleclicked(pole: PoleModel) {

    }
    hover(pole: PoleModel) {
        this.poles.forEach(_pole => _pole.hover = false);
        this.actualRocket.pattern.forEach(point => {
            const soucetBodu = Point.Sum(point, pole.pozice);
            if(soucetBodu.x >= 0 && soucetBodu.x <= 20 && soucetBodu.y >= 0 && soucetBodu.y <= 20)
                this.poles[Point.toNumber(soucetBodu)].hover = true;
        });
    }
    mouseout() {
        this.poles.forEach(pole => pole.hover = false);
    }
}
