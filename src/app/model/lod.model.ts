import {Point} from './pole.model';

export class LodModel {
    public smer: Smer;
    constructor(
        public data: LodData,
        public pozice: Point
    ){
        this.smer = Smer.Nahoru;
    }
    get castiLode() : CastLode[] {
        const casti = [];
        this.data.casti[this.smer % 2 === 0 ? 'rovne' : 'sikmo'].forEach(cast => {
            casti.push({
                pozice: Point.Sum(Smerhandlers[this.smer](cast), this.pozice)
            });
        });
        return casti;
    }
    get viewData() : LodViewData {
        return {
            imgUrl: this.data.imgUrl,
            smer: this.smer,
            posun: this.posun
        };
    }
    get posun() : {vert: number, hori: number}{
        const data = this.data.posun[this.smer % 2 === 0 ? 'rovne' : 'sikmo'];
        if(data == null) return {vert: 0, hori: 0};
        return data;
    }
    public clone(): LodModel {
        const lod = new LodModel(this.data, this.pozice);
        lod.smer = this.smer;
        return lod;
    }
    public otocSe(){
        this.smer = (this.smer + (this.data.osmismerna ? 1 : 2)) % 8;
    }
}
export class LodData {
    constructor(
        public uid: string,
        public name: string,
        public trida: string,
        public casti: Casti,
        public posun: Posun,
        public imgUrl: string,
        public osmismerna: boolean
    ){}
}
export interface LodViewData {
    imgUrl: string;
    smer: Smer;
    posun: {vert: number, hori: number} | null;
}
export interface LodDoc {
    LodDataUid: string;
    smer: Smer;
    pozice: Point;
}
export interface Posun {
    rovne: { vert: number, hori: number } | null;
    sikmo: { vert: number, hori: number } | null;
}
export interface Casti {
    rovne: Point[];
    sikmo: Point[];
}
export interface CastLode {
    pozice: Point;
}
export enum Smer {
    Nahoru = 0,
    NahoruPravo = 1,
    Pravo = 2,
    PravoDolu = 3,
    Dolu = 4,
    DoluLevo = 5,
    Levo = 6,
    Levonahoru = 7
}
export const Smerhandlers: ((data: Point) => Point)[] = [
    (data: Point) => data,  // 0
    (data: Point) => data,  // 1
    (data: Point) => {
        return {x: -data.y, y: data.x};
    }, // 2
    (data: Point) => {
        return Smerhandlers[2](data);
    }, // 3
    (data: Point) => {
        return {x: -data.x, y: -data.y};
    }, // 4
    (data: Point) => {
        return {x: -data.x, y: -data.y};
    }, // 5
    (data: Point) => {
        return {x: data.y, y: -data.x};
    }, // 6
    (data: Point) => {
        return {x: data.y, y: -data.x};
    }  // 7
];
