export abstract class Ship {
  casti: Array<CastLodi>;
  name: string;
  poziceCasti(): Array<Pozice> {
    const pozice = new Array<Pozice>();
    this.casti.forEach(function (cast) {
      pozice.push(cast.pozice);
    });
    return pozice;
  }
}

export class CastLodi {
  pozice: Pozice;
}

export class Pozice {
  private _x: number;
  private _y: number;

  get x(): number {
    return this._x;
  }
  set x(value: number) {
    value = Math.floor(value);
    this._x = value;
  }
  get y(): number {
    return this._y;
  }
  set y(value: number) {
    value = Math.floor(value);
    this._y = value;
  }
}

