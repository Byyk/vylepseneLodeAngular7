import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {GameState} from '../services/gs2.service';

export class Storage<T extends Object>  {
    private data: T;
    private readonly _emitors: Emitors<T>;
    private readonly _transformers: Transformers<T>;

    private update() {
        this.check();
    }

    constructor(emitors: Emitors<T>, transformers: Transformers<T>) {
        this.data = {} as T;
        this._emitors = emitors;
        this._transformers = transformers;
    }

    getEmitor(name: string) {
        if(!this._emitors.hasOwnProperty(name)) console.error(`Emitor "${name}" Neexistuje!`);
        else return this._emitors[name].asObservable();
    }

    addTransformer<A>(name: string, transformer: Transformer<T, A>) {
        if(!this._transformers.hasOwnProperty(name))
        {
            this._transformers[name] = transformer;
            this.check();
        }
        else console.error('tento transformer jíž existuje!');
    }

    getTransformer<A>(name: string) {
        if(!this._transformers.hasOwnProperty(name))
            console.error(`Emitor "${name}" Neexistuje!`);
        else return this._transformers[name].asObservable() as Observable<A>;
    }

    collect(obs: Observable<any>, transform: (data: any) => T) {
        obs.pipe(map(transform)).subscribe(
            data => {
                for(const key in data) {
                    if(data.hasOwnProperty(key))
                        this.data[key] = data[key];
                }
                this.update();
            }
        );
    }

    clear() {
        this.data = {} as T;
    }

    getData<A>(quarry?: (data: T) => A) {
        if(quarry == null)
            return {...this.data as object} as A;
        return quarry({...this.data as object} as T);
    }
    updateData(quarry: (data: GameState) => void) {
        quarry(this.data);
        this.check();
    }

    private check() {
        for(const key in this._emitors) {
            const vyledek = this._emitors[key].check(this.data);
            if(this._emitors[key].getValue() !== vyledek)
                this._emitors[key].next(vyledek);
        }

        for(const key in this._transformers) {
            this._transformers[key].update(this.data);
        }
    }
}

export interface Emitors<T> {
    [key: string]: Emitor<T>;
}

export interface Transformers<T> {
    [key: string]: Transformer<T>;
}

export class Emitor<T> extends BehaviorSubject<boolean>{
    check: (data: T) => boolean;
    constructor(checker: (data: T) => boolean) {
        super(false);
        this.check = checker;
    }
}

export class Transformer<T, A = any> extends BehaviorSubject<A>{
    data: A;
    check: (data: T, lastData: A) => boolean;
    transform: (data: T) => A;
    constructor(
        transformer: (data: T) => A,
        checker: (data: T, lastData: A) => boolean = () => true
    ) {
        super(null);
        this.check = checker;
        this.transform = transformer;
    }
    update(data: T) {
        if(!this.check(data, this.data)) return;
        this.data = this.transform(data);
        this.next(this.data);
    }
}

export class StorageBuilder {
    public static Build<T>(
        emitors: EmitorData<T>[],
        transformers: TransformerData<T>[]
    ): Storage<T> {
        const _emitors = {};
        const _transformers = {};
        for(const emitor of emitors ) {
            _emitors[emitor.name] = new Emitor(emitor.checker);
        }
        for(const trans of transformers) {
            if(trans.checker != null)
                _transformers[trans.name] = new Transformer<T>(trans.transformer, trans.checker);
            else _transformers[trans.name] = new Transformer<T>(trans.transformer);
        }
        return new Storage<T>(_emitors, _transformers);
    }
}

export interface EmitorData<T> {
    checker: ((data: T) => boolean);
    name: string;
}

export interface TransformerData<T, A = any> {
    checker?: (data: T, lastData: A) => boolean;
    transformer: (data: T) => A;
    name: string;
}
