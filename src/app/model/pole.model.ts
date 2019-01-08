import {CastLode, LodViewData} from './lod.model';

export interface PoleModel {
    pozice: Point;
    state: StavPole;
    dalsicasti?: CastLode[];
    lod?: LodViewData;
    hover?: boolean;
}

export class Point {
    public static fromNumber(number: number) : Point {
        return {x: number % 21, y: number / 21};
    }
    public static toNumber(point: Point) {
        return point.y * 21 + point.x;
    }
    public static Sum(point1: Point, point2: Point) {
        return {x: point1.x + point2.x, y: point1.y + point2.y};
    }
    public static Equals(point1: Point, point2: Point) : boolean{
        return point1.x === point2.x && point1.y === point2.y;
    }

    constructor(point: Point) {
        this.x = point.x;
        this.y = point.y;
    }

    x: number;
    y: number;
}

export enum StavPole {
    more = 1,
    lod = 2,
    poskozenaLod = 3,
    znicenaLod = 4,
    zasazeneMore = 5,
    chybaPokladani = 6
}
