import {LodData, LodDoc} from './lod.model';
import {Limits} from '../services/game.service';
import {IconDefinition} from '@fortawesome/fontawesome-common-types';
import {Observable} from 'rxjs';
import {Point} from './pole.model';

export class MyBoardModel {
    myBoardData: MyBoardData;
    constructor() {
        this.myBoardData = {};
    }
}
export interface MyBoardData {
    placedShips?: LodDoc[];
    ships?: LodData[];
    limits?: Limits;
    rozmisteno?: boolean;
}
export class MenuModel {
    constructor(
        public tabs: Tab[]
    ){}
}
export interface Tab {
    icon: IconDefinition | string;
    toolTip?: string;
    subMenu?: Observable<DOCData>;
    doc?: string;
}
export interface DOCData {
    [key: string]: AbilityData | number;
    cooldown: number;
    type: number;
}
export interface OnlyDocData {
    [key: string]: AbilityData;
}
export interface AbilityData {
    cost: number;
    name: string;
    icon: string;
    pattern: Point[];
    typ: string;
    supTyp: string;
}
