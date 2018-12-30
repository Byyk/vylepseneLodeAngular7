import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
    private _actualField = new BehaviorSubject<Field>(Field.playerField);
    public ActualField = Field.playerField;
    public actualField: Observable<Field>;

    private _actualMode = new BehaviorSubject<Mode>(Mode.Nada);
    public ActualMode = Mode.Nada;
    public actualMode: Observable<Mode>;

    constructor() {
        this.actualField = this._actualField.asObservable();
        this.actualField.subscribe((data) => this.ActualField = data);

        this.actualMode = this._actualMode.asObservable();
        this.actualMode.subscribe((data) => this.ActualMode = data);
    }
    public swapField(){
        if(this.ActualField === Field.playerField)
            this._actualField.next(Field.enemyField);
        else this._actualField.next(Field.playerField);
    }
    public changeMode(mode: Mode){
        switch (mode) {
            case Mode.PlaceShips:
                this._actualField.next(Field.playerField);
                break;
            case Mode.Attack:
                this._actualField.next(Field.enemyField);
                break;
            case Mode.HeavyAttack:
                this._actualField.next(Field.enemyField);
                break;
            case Mode.SpecAbility:
                // Todo spec abi imp
                console.error('spec. abil. není implementována!');
                break;
            case Mode.MoveShips:
                this._actualField.next(Field.playerField);
                break;
            case Mode.SafeCraw:
                this._actualField.next(Field.playerField);
                break;
            default:
                console.error('neocekavana hodnota!');
        }

        this._actualMode.next(mode);
    }
}

export enum Field {
    playerField = 1,
    enemyField = 2
}
export enum Mode {
    Nada = 0,
    Attack = 1,
    HeavyAttack = 2,
    SpecAbility = 3,
    MoveShips = 4,
    SafeCraw = 5,
    PlaceShips = 6
}
