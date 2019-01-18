import { Point } from './pole.model';
export interface TahModel {
    seenFor: 'creator' | 'opponent';
    type: 'Utok';
    tahData: TahData; 
}

export type TahData = Utok;

export class Utok {
    poziceZasahu: Point;
    typ: 'Common' | 'Bombardment' | 'TrumpsAtomBlast';
    subTyp: string;
}
