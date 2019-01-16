import {Point} from './pole.model';

export class RaketaModel {
    public cost: number;
    public cooldown: number;
    public pattern: Point[];
    type: number;
}

export interface Raketa {
    typ: 'Common' | 'Bombardment' | 'TrumpsAtomBlast';
    subTyp: string;
    cooldown: number;
    type: number;
    pattern: Point[];
}
