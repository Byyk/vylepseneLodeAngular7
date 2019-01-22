import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export class Storage<T extends Object>  {
    private data: T;
    private readonly _emitors: Emitors<T>;

    constructor(emitors: Emitors<T>) {
        this.data = {} as T;
        this._emitors = emitors;
    }

    getEmitor(key: string) {
        if(!this._emitors.hasOwnProperty(key)) console.error(`Emitor "${key}" Neexistuje!`);
        else return this._emitors[key].asObservable();
    }

    collect(obs: Observable<any>, transform: (data: any) => T) {
        obs.pipe(map(transform)).subscribe(
            data => {
                for(const key in data) {
                    if(data.hasOwnProperty(key))
                        this.data[key] = data[key];
                }
                this.check();
            }
        );
    }

    clear() {
        this.data = {} as T;
    }

    getData() {
        return this.data;
    }

    private check() {
        for(const key in this._emitors) {
            const vyledek = this._emitors[key].check(this.data);
            if(this._emitors[key].getValue() !== vyledek)
                this._emitors[key].next(vyledek);
        }
    }
}

export interface Emitors<T> {
    [key: string]: Emitor<T>;
}

export class Emitor<T> extends BehaviorSubject<boolean>{
    check: (data: T) => boolean;
    constructor(checker: (data: T) => boolean) {
        super(false);
        this.check = checker;
    }
}

export class StorageBuilder {
    public static Build<T>(emitors: EmitorData<T>[]): Storage<T> {
        const _emitors = {};
        for(const emitor of emitors ) {
            _emitors[emitor.name] = new Emitor(emitor.checker);
        }
        return new Storage<T>(_emitors);
    }
}

export interface EmitorData<T> {
    checker: ((data: T) => boolean);
    name: string;
}
