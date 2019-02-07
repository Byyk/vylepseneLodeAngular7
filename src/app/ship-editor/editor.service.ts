import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {LodData} from "../model/lod.model";
import {map} from "rxjs/operators";
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class EditorService {

    data: LodData[] = [];
    dataLoaded = new BehaviorSubject(false);

    constructor(
        private afs: AngularFirestore
    ) {
        this.loadLodeData();
    }

    loadLodeData() {
        this.afs.collection<LodData>('Lode', ref => ref.orderBy('rank'))
            .get().pipe(
                map(docs =>
                    docs.docs.map(doc => doc.data()))
        ).subscribe(data =>{
            this.data = data as LodData[];
            this.dataLoaded.next(true);
            });
    }

}
