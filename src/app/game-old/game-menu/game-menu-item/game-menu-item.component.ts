import {Component, Input, OnInit} from '@angular/core';
import {emitors, Gs2Service} from '../../../services/gs2.service';
import {LodData} from '../../../model/lod.model';

@Component({
  selector: 'app-game-menu-item',
  templateUrl: './game-menu-item.component.html',
  styleUrls: ['./game-menu-item.component.scss']
})
export class GameMenuItemComponent implements OnInit {
    public disabled: boolean;

    @Input()
    public rank: number;
    @Input()
    public lod: LodData;

    constructor(
        public gs2: Gs2Service
    ) { }

    ngOnInit() {
        this.gs2.storage.getEmitor(emitors.limits).subscribe(is => {
            if(!is) return;
            this.disabled = this.gs2.storage.getData(data => data.limits[this.rank]) === 0;
        });
    }

    click(lod: LodData) {
        if(this.disabled) return;
        this.gs2.selectShip(lod);
    }
}
