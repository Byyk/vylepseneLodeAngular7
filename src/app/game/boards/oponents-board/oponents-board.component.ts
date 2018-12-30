import {Component, OnInit, ViewChild} from '@angular/core';
import {Point, PoleModel, StavPole} from '../../../model/pole.model';
import {GameService} from '../../../services/game.service';

@Component({
  selector: 'app-oponents-board',
  templateUrl: './oponents-board.component.html',
  styleUrls: ['./oponents-board.component.scss']
})
export class OponentsBoardComponent implements OnInit {
    public poles = new Array<PoleModel>();

    @ViewChild('list')
    public list;

    constructor(
        public gs: GameService
    ) {
        for(let i = 0; i < 21; i++) {
            for(let j = 0; j < 21; j++){
                this.poles.push({pozice: {x: j, y: i}, state: StavPole.more});
            }
        }
    }
    getHeight(){
        return this.list._element.nativeElement.offsetHeight + 'px';
    }
    poleclicked(pole: PoleModel) {

    }

    ngOnInit() {
    }

}
